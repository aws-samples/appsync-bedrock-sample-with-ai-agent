import * as fs from 'fs';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { AppsyncFunction, BaseDataSource, Code, FunctionRuntime, GraphqlApi, Resolver } from 'aws-cdk-lib/aws-appsync';

type JSResolverConfiguration = {
    dataSource: BaseDataSource,
    code?: string,
    codePath?: string
    replacements?: {
        [key: string] : string
    }
}

function jsResolverCode (name: string, codePath?: string) {
    return fs.readFileSync(path.join(codePath || __dirname, `functions-js/${name}.js`), 'utf8')
}

export function addJsResolver ( scope: Construct, api: GraphqlApi, typeField: string, resolvers: JSResolverConfiguration | JSResolverConfiguration[] ) {

    let [type, field] = typeField.split('.')
    let resolverConfigs = (Array.isArray(resolvers) ? resolvers : [resolvers]) as JSResolverConfiguration[]

    let functions = resolverConfigs.map((f, i) => {
        let name = `${type}_${field}_${i}`
        let code = jsResolverCode(f.code || typeField, f.codePath)
        if (f.replacements) {
            Object.keys(f.replacements).forEach((key) => {
                if (f.replacements)
                    code = code.replaceAll('$' + key, f.replacements[key])
            })
        }

        return new AppsyncFunction(
            scope,
            name,
            {
                name, api,
                dataSource: f.dataSource,
                runtime: FunctionRuntime.JS_1_0_0,
                code: cdk.aws_appsync.Code.fromInline(code),
            }
        )
    })

    new Resolver(scope, `${type}_${field}_resolver`, {
		api,
		typeName: type,
		fieldName: field,
		code: Code.fromInline(`
            export function request(ctx) { return {} }
            export function response(ctx) { return ctx.prev.result }
        `),
		runtime: FunctionRuntime.JS_1_0_0,
		pipelineConfig: functions,
	})

}