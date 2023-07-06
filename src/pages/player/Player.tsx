import React, { useContext, useEffect, useRef, useState } from 'react'
import './player.css'
import { MainContext } from '../../context'
import ReactPlayer from 'react-player';
import { DyteStore } from '@dytesdk/plugin-sdk';
import { timeDelta } from '../../utils/helpers';
import Modal from '../../components/modal/Modal';

interface PlayerConfig {
    state: 'idle' | 'playing' | 'paused';
    played: number;
    loaded: number;
    lastUpdated: number;
    playedSeconds: number;
}

const initialConfig: PlayerConfig = {
    state: 'idle',
    played: 0,
    loaded: 0,
    lastUpdated: +new Date(),
    playedSeconds: 0,
}

const Player = () => {
    const { plugin, activePlayer, link} = useContext(MainContext);
    const playerEl = useRef<ReactPlayer>(null);
    const [config, setConfig] = useState<PlayerConfig>(initialConfig);
    const [started, setStarted] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const store: DyteStore = plugin.stores.create('player-store');
        store.subscribe('state', ({state}) => {
            setConfig({...config, ...state });
            if (started) {
                manageSeek(state);
            }
            manageSeek({...config, ...state});
        })

        return () => {
            store.unsubscribe('state');
        }
    }, [started])

    const handleOnPlay = async () => {
        console.log('handle on play triggered...')
        const store = plugin.stores.get('player-store');
        // if not started
        if (!started) { 
            setStarted(true);
            // app's first action
            if (config.state === 'idle') {
                console.log('apps first action')
                await store.set('state', {...config, lastUpdated: +new Date(), state: 'playing'});
            } 
            // joining watch party
            manageSeek(config, true);
            return;
        } 
    }

    const handleOnProgress = (s: any) => {
        setConfig({
            ...config,
            loaded: s.loaded,
            played: s.played,
            playedSeconds: s.playedSeconds,
            lastUpdated: +new Date(),
        })
    }

    const playVideo = async (remote: boolean = false) => {
        const p = playerEl.current?.getInternalPlayer();

        if (activePlayer === 'youtube') p?.playVideo();
        if (activePlayer === 'file') p?.play();
        if (activePlayer === 'vimeo') p?.play();
        if (remote) return;
        const store = plugin.stores.get('player-store');
        await store.set('state', {...config, lastUpdated: +new Date(), state: 'playing'});
    }
    const pauseVideo = async (remote: boolean = false) => {
        const p = playerEl.current?.getInternalPlayer();
        if (activePlayer === 'youtube') p?.pauseVideo();
        if (activePlayer === 'file') p?.pause();
        if (activePlayer === 'vimeo') p?.pause();
        if (remote) return;
        const store = plugin.stores.get('player-store');
        await store.set('state', {...config, lastUpdated: +new Date(), state: 'paused'});
    }

    const handleFirstClick = () => {
        console.log('here....')
        if (activePlayer === 'file') playerEl.current?.getInternalPlayer().play();
        if (activePlayer === 'vimeo') playerEl.current?.getInternalPlayer().play();
    }

    const manageSeek = (data: PlayerConfig, s = false) => {
        console.log(data);
        if (!playerEl?.current) return;
        const fraction = (timeDelta(data.playedSeconds, data.lastUpdated))/playerEl.current.getDuration();
        if (data.state === 'playing') {
            playerEl.current.seekTo(parseFloat(fraction.toString()));
            console.log(started || s);
            if (started || s) playVideo(true);
        }
        if (data.state === 'paused')  {
            console.log(started || s);
            playerEl.current.seekTo(parseFloat(data.played.toString()));
            if (started || s) pauseVideo(true);
        }
    }

    
    return (
        <div className="player">
            <ReactPlayer
                width='100%'
                height='90%'
                id="test"
                url={link}
                muted={false}
                volume={0.8}
                ref={playerEl}
                onProgress={handleOnProgress}
                onPlay={handleOnPlay}
                onDuration={() => {
                    setLoaded(true);
                }}
                controls={false}
            />
            {started && <div className='overlay'></div>}
            {
                !started && loaded && (
                    <Modal
                        playerEl={playerEl}
                        label={config.state !== 'idle' ? "Join Watchparty" :"Start Watchparty"}
                        description = {config.state === 'idle' ? "This will notify everyone that a watchparty has started." :"Someone started the watchparty 🎉. Click to Join."}
                        cta={config.state === 'idle' ? "Start" : "Join"}
                        onClick={handleFirstClick}
                    />
                )
            }
            {started && <div className={`overlay ${activePlayer}`}></div>}
            <button onClick={() => playVideo()}>Play</button>
            <button onClick={() => pauseVideo()}>Pause</button>
        </div>
    )
}

export default Player
