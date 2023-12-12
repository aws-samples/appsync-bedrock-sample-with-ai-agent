import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ConfigurationPage } from './pages/configuration-sidebar';
import { ConfigurationNewAgent } from './pages/configuration-new-agent';
import { ConfigurationViewAgent } from './pages/configuration-view-agent';
import { AIAgentSidebar } from './pages/agent-api-sidebar';
import PageWrapper from './library/toggle';
import { AIAgentNewChat } from './pages/agent-api-new-chat';
import { AIAgentViewChat } from './pages/agent-api-view-chat';
//@ts-ignore
import Prism from "prismjs";
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-json';
import './prism.css'
import { ConfigurationNewAction } from './pages/configuration-new-action';
import { ConfigurationViewAction } from './pages/configuration-view-action';
import '@aws-amplify/ui-react/styles.css';
import './index.css';
import { Amplify } from 'aws-amplify';
import { agentApiEndpoint, cognitoConfig } from './endpoints';

// Load auth config data
Amplify.configure({ 
  Auth: cognitoConfig, 
  API: { aws_appsync_graphqlEndpoint: agentApiEndpoint },
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS'
})

// Force import of prismjs, if the value is not references its not loaded
console.log('loading prism' || Prism)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RecoilRoot>
    <BrowserRouter>
      <PageWrapper>
        <Routes>
          <Route path="/configuration" element={<ConfigurationPage />} >
            <Route path="/configuration/agent-new" element={<ConfigurationNewAgent />} />
            <Route path="/configuration/action-new" element={<ConfigurationNewAction />} />
            <Route path="/configuration/agent/:agentId" element={<ConfigurationViewAgent />} />
            <Route path="/configuration/action/:actionId" element={<ConfigurationViewAction />} />
          </Route>
          <Route path="/chat" element={<AIAgentSidebar />} >
            <Route path="/chat/new" element={<AIAgentNewChat />} />
            <Route path="/chat/view/:chatId" element={<AIAgentViewChat />} />
          </Route>
          <Route path="/" element={<Navigate to="/chat" replace/>} />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  </RecoilRoot>
);