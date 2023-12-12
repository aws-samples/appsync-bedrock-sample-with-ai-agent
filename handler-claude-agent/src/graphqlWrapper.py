import json, uuid
from typing import Any, Callable, Dict, Optional

from pydantic import BaseModel, Extra, root_validator
from graphql import print_ast
from .chatResponder import ChatResponder

class GraphQLAPIWrapper(BaseModel):
    """Wrapper around GraphQL API.

    To use, you should have the ``gql`` and ``graphql`` python packages installed.
    This wrapper will use the GraphQL API to conduct queries.
    """

    custom_headers: Optional[Dict[str, str]] = None
    disable_schema_prompt: bool = False
    graphql_endpoint: str
    gql_client: Any  #: :meta private:
    gql_function: Callable[[str], Any]  #: :meta private:
    custom_transport_auth: Any  #: :meta private:
    gql_schema: str

    class Config:
        """Configuration for this pydantic object."""

        extra = Extra.forbid

    @root_validator(pre=True)
    def validate_environment(cls, values: Dict) -> Dict:
        """Validate that the python package exists in the environment.
        Pull graphql schema using introspection query if asked."""
        try:
            from gql import Client, gql
            from gql.transport.requests import RequestsHTTPTransport
            from graphql import (
                GraphQLScalarType,
                build_client_schema,
                get_introspection_query,
            )
            from graphql.utilities.print_schema import print_filtered_schema

        except ImportError as e:
            raise ImportError(
                "Could not import gql or graphql python package. "
                f"Try installing it with `pip install gql graphql`. Received error: {e}"
            )
        headers = values.get("custom_headers", {})
        customAuth = values.get("custom_transport_auth", None)
        transport = RequestsHTTPTransport(
            url=values["graphql_endpoint"], headers=headers, auth=customAuth
        )

        client = Client(transport=transport, fetch_schema_from_transport=True)
        values["gql_client"] = client
        values["gql_function"] = gql

        disable_schema_prompt = values.get("disable_schema_prompt", False)
        values["gql_schema"] = ""

        if disable_schema_prompt:
            return values

        query_intros = get_introspection_query(descriptions=True)
        document_node = gql(query_intros)
        intros_result: Any = client.execute(document_node)

        # Removes introspection fields, directives, and scalars from schema
        # These are redundant and cause confusion with the model
        values["gql_schema"] = print_filtered_schema(
            build_client_schema(intros_result),
            directive_filter=lambda n: False,
            type_filter=lambda n: not (
                n.name.startswith("_") or isinstance(n, GraphQLScalarType)
            ),
        )

        return values

    def tryFixQuery(self, query: str) -> str:
        
        likely_type = 'query'

        # Bots sometimes wraps in triple quotes
        query = query.replace('`', '').strip()

        # Bots also like json object response
        try:
            if query.startswith('{') and query.endswith('}'):
                tryParsed = json.loads(query)
                if 'query' in tryParsed:
                    query = tryParsed['query']
                if 'mutation' in tryParsed:
                    query = tryParsed['mutation']
                    likely_type = 'mutation'
        except: 
            pass

        try: 
            if query.startswith('{') and query.endswith('}'):
                if 'mutation' in query:
                    query = query[1:-1]
        except: pass

        # Sometimes the prefix format is bad
        if query.endswith('}'):
            prefix = query.split('{')[0].strip()
            if prefix not in ['query', 'mutation']:
                first_paren = query.index('{')
                query = query[first_paren:]            

        # Sometimes they forget the 'query' prefix
        if not query.startswith('query') and not query.startswith('mutation'):
            query = f'{likely_type} {query}'

        # With this process, we might get multiple queries, try to fix that
        if query.count('query') > 1 and query.count('mutation') == 0:
            query = 'query' + query.split('query')[-1]
        if query.count('mutation') > 1:
            query = 'mutation' + query.split('mutation')[-1]

        # Also, fix if we have both query and mutation
        if query.count('query') > 0 and query.count('mutation') > 0:
            query = query.replace('mutation', '')

        return query

    def run(self, query: str) -> str:

        queryString = ""

        try:
            query = self.tryFixQuery(query)
            document_node = self.gql_function(query)
            queryString = print_ast(document_node)
        except Exception as e:
            queryString = query

        try:
            result = self._execute_query(queryString)
            if result.__class__.__name__ == 'GraphQLError':
                raise Exception(result.errors)
            ChatResponder.instance.publish_agent_start_action(queryString)
            ChatResponder.instance.publish_agent_result_action(queryString, json.dumps(result, indent=2))
            return json.dumps(result, indent=2)
        except Exception as e:
            print(e)
            ChatResponder.instance.publish_agent_start_action(queryString)                
            ChatResponder.instance.publish_agent_result_action(queryString, str(e))

    def _execute_query(self, query: str) -> Dict[str, Any]:
        """Execute a GraphQL query and return the results."""
        document_node = self.gql_function(self.tryFixQuery(query))
        result = self.gql_client.execute(document_node)
        return result
