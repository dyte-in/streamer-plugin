import DytePlugin from '@dytesdk/plugin-sdk';
import React, { useEffect, useState } from 'react'

const MainContext = React.createContext<any>({});

type PlayerType = 'youtube' | 'vimeo' | 'facebook' | 'twitch' | 'file' | '';

const MainProvider = ({ children }: { children: any }) => {
    const [link, setLink] = useState<string>('');
    const [activePlayer, setActivePlayer] = useState<PlayerType>('');
    const [plugin, setPlugin] = useState<DytePlugin>();

    const loadPlugin = async () => {
        // initialize the SDK
        const dytePlugin = DytePlugin.init();

        // populate store
        await dytePlugin.stores.populate('player-store');

        // load initial data
        const playStore = dytePlugin.stores.create('player-store');
        const url = playStore.get('url');
        const player = playStore.get('activePlayer');


        if (url) setLink(url);
        if (player) setActivePlayer(player);
    
        // subscribe to store changes
        playStore.subscribe('url', ({ url }) => {
            setLink(url);
        })
        playStore.subscribe('activePlayer', ({ activePlayer }) => {
            setActivePlayer(activePlayer === 'none' ? undefined: activePlayer);
        })

        setPlugin(dytePlugin);
    }

    useEffect(() => {
        loadPlugin();
        return () => {
            if (!plugin) return;
        }
    }, [])

    return (
        <MainContext.Provider value={{ plugin, link, setLink, activePlayer, setActivePlayer }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 