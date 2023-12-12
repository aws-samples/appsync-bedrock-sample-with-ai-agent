import { Button, ColorMode, Flex, View, withAuthenticator } from "@aws-amplify/ui-react"
import { useNavigate } from "react-router-dom"
import { ThemeProvider, defaultDarkModeOverride } from '@aws-amplify/ui-react';
import { useState } from "react";
import { enableConfigureAgents } from "../endpoints";

const darkTheme = {
  name: 'my-theme',
  overrides: [defaultDarkModeOverride],
};

function PageWrapper (props: any) {

    const nav = useNavigate()
    const [theme, setTheme] = useState<ColorMode>('light');

    const isChat = document.location.href.includes('/chat')
    const isLight = theme === 'light'

    const onTogglePage = () => {
        if (isChat)
            nav('/configuration')
        else 
            nav('/chat')
    }

    const onToggleTheme = () => {
        if (theme === 'dark')
            setTheme('light')
        else 
            setTheme('dark')
    }

    return (
        <ThemeProvider theme={darkTheme} colorMode={theme}>
            <View className="page" backgroundColor={isLight? 'rgb(247, 246, 246)' : 'black'}>
                <Flex className="themeTogglePanel">
                    {
                        enableConfigureAgents && (
                            <Button className="iconButton" onClick={onTogglePage}>
                                {
                                    !isChat && <i className="fa-solid fa-comment"></i>
                                }
                                {
                                    isChat && <i className="fa-solid fa-wrench"></i>
                                }
                            </Button>
                        )
                    }
                    <Button className="iconButton" onClick={onToggleTheme}>
                        {
                            !isLight && <i className="fa-solid fa-moon"></i>
                        }
                        {
                            isLight && <i className="fa-solid fa-sun"></i>
                        }
                    </Button>
                </Flex>
                {props.children}
            </View>
        </ThemeProvider>
    )
}

export default withAuthenticator(PageWrapper)