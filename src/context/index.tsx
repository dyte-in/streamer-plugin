import React, { useState } from 'react'

const MainContext = React.createContext<any>({});

const MainProvider = ({ children }: { children: any }) => {
    const [document, setDocument] = useState<string>();

    return (
        <MainContext.Provider value={{ document, setDocument }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 