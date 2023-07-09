import DytePlugin from '@dytesdk/plugin-sdk';
import React, { useEffect, useState } from 'react'
import { canPlay } from '../utils/helpers';

const MainContext = React.createContext<any>({});

type PlayerType = 'youtube' | 'vimeo' | 'facebook' | 'twitch' | 'file' | '';
interface GlobalConfig {
    loop: boolean;
    hideBack: boolean;
}

const MainProvider = ({ children }: { children: any }) => {
    const [link, setLink] = useState<string>('');
    const [activePlayer, setActivePlayer] = useState<PlayerType>('');
    const [plugin, setPlugin] = useState<DytePlugin>();
    const [globalConf, setGlobalConf] = useState<GlobalConfig>({ loop: false, hideBack: true });

    const loadPlugin = async () => {
        // initialize the SDK
        const dytePlugin = DytePlugin.init({ ready: false });

        // populate store
        await dytePlugin.stores.populate('player-store');

        // load initial data
        const playStore = dytePlugin.stores.create('player-store');
        const url = playStore.get('url');
        const player = playStore.get('activePlayer');

        // listen for config event from web-core
        dytePlugin.room.on('config', async ({payload}) => {
            const { link, loop, hideBack } = payload;
            const player = canPlay(link);
            if (player) {
                setActivePlayer(player);
                if (link) setLink(link.trim());
                setGlobalConf({ ...globalConf, loop, hideBack });
            }
            console.log('error...')
            // TODO: handle errors
        })


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
        dytePlugin.ready();
    }

    useEffect(() => {
        loadPlugin();
        return () => {
            if (!plugin) return;
        }
    }, [])

    return (
        <MainContext.Provider value={{ globalConf, plugin, link, setLink, activePlayer, setActivePlayer }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContext, MainProvider } 