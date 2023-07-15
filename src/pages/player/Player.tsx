import React, { useContext, useEffect, useRef, useState } from 'react'
import './player.css'
import { MainContext } from '../../context'
import ReactPlayer from 'react-player';
import { DyteStore } from '@dytesdk/plugin-sdk';
import { timeDelta } from '../../utils/helpers';
import Modal from '../../components/modal/Modal';
import Controls from '../../components/controls/Controls';

export interface PlayerConfig {
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
    const { isRecorder, setError, plugin, globalConf, setLink, activePlayer, link, setActivePlayer } = useContext(MainContext);
    const playerEl = useRef<ReactPlayer>(null);
    const [volume, setVolume] = useState<number>(1);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    const [seeking, setSeeking] = useState<boolean>(false);
    const [config, setConfig] = useState<PlayerConfig>(initialConfig);

    // handle remote controls
    useEffect(() => {
        const store: DyteStore = plugin.stores.create('player-store');
        const remoteConfig = store.get('state');
        if (remoteConfig) setConfig({...initialConfig, ...remoteConfig});
        store.subscribe('state', ({state}) => {
            setConfig({...config, ...state });
            if (started) {
                manageSeek(state);
            }
            manageSeek({...config, ...state}, isRecorder);
        })

        return () => {
            store.unsubscribe('state');
        }
    }, [started])

    useEffect(() => {
        if (isRecorder) setStarted(true);
    }, [isRecorder])
    const manageSeek = (data: PlayerConfig, s = false, remote = true) => {
        if (!playerEl?.current) return;
        const fraction = (timeDelta(data.playedSeconds, data.lastUpdated))/playerEl.current.getDuration();
        if (data.state === 'playing') {
            playerEl.current.seekTo(parseFloat(fraction.toString()));
            if (started || s) playVideo(remote);
        }
        if (data.state === 'paused')  {
            playerEl.current.seekTo(parseFloat(data.played.toString()));
            if (started || s) pauseVideo(remote);
        }
    }

    // handle first play
    const handleFirstClick = () => {
        if (activePlayer === 'file') playerEl.current?.getInternalPlayer().play();
        if (activePlayer === 'vimeo') playerEl.current?.getInternalPlayer().play();
    }
    const handleOnPlay = async () => {
        const store = plugin.stores.get('player-store');
        // if not started
        if (!started) { 
            setStarted(true);
            // app's first action
            if (config.state === 'idle') {
                const newConfig: PlayerConfig = {
                    ...config,
                    lastUpdated: +new Date(),
                    state: 'playing'
                }
                await store.set('state', newConfig);
                setConfig(newConfig);
            } 
            // joining watch party
            manageSeek(config, true);
            return;
        } 
    }

    // update config
    const handleOnProgress = (s: any) => {
       if (!started || seeking) return;
        setConfig({
            ...config,
            loaded: s.loaded,
            played: s.played,
            playedSeconds: s.playedSeconds,
            lastUpdated: +new Date(),
        })
    }

    // controls
    const playVideo = async (remote: boolean = false) => {
        const p = playerEl.current?.getInternalPlayer();

        if (activePlayer === 'youtube') p?.playVideo();
        if (activePlayer === 'file') p?.play();
        if (activePlayer === 'vimeo') p?.play();
        if (remote) return;
        const store = plugin.stores.get('player-store');
        await store.set('state', {...config, lastUpdated: +new Date(), state: 'playing'});
        setConfig({
            ...config,
            lastUpdated: +new Date(),
            state: 'playing',
        })
    }
    const pauseVideo = async (remote: boolean = false) => {
        const p = playerEl.current?.getInternalPlayer();
        if (activePlayer === 'youtube') p?.pauseVideo();
        if (activePlayer === 'file') p?.pause();
        if (activePlayer === 'vimeo') p?.pause();
        if (remote) return;
        const store = plugin.stores.get('player-store');
        await store.set('state', {...config, lastUpdated: +new Date(), state: 'paused'});
        setConfig({
            ...config,
            lastUpdated: +new Date(),
            state: 'paused',
        })
    }
    const onSeekDown = (e: any) => { 
        setSeeking(true);
    }
    const onSeekChange = (e: any) => {
        const duration = playerEl?.current?.getDuration() ?? 1;
        setConfig((c) => ({ 
            ...c,
            playedSeconds: e.target.value * duration,
            played: parseFloat(e.target.value),
            lastUpdated: +new Date(),
        }));
        playerEl?.current?.seekTo(parseFloat(e.target.value));
    }
    const onSeekUp = (e: any) => { 
        const duration = playerEl?.current?.getDuration() ?? 1;
        setConfig((c) => ({ 
            ...c,
            playedSeconds: e.target.value * duration,
            played: parseFloat(e.target.value),
            lastUpdated: +new Date(),
        }));
        manageSeek(
            {
                ...config,
                playedSeconds: e.target.value * duration,
                played: parseFloat(e.target.value),
                lastUpdated: +new Date(),
            },
            started,
            false,
        )
        setSeeking(false);
    }
    const togglePlayer = () => {
        if (config.state === 'playing') pauseVideo();
        if (config.state === 'paused') playVideo();
    }
    const handleVolume = (e: any) => {
        setVolume(e.target.value)
    }
    const goBack = async () => {
        setLink('');
        setConfig(initialConfig);
        setStarted(false);
        setActivePlayer(undefined);
        await plugin.stores.get('player-store').set('url', '');
        await plugin.stores.get('player-store').set('state', undefined);
        await plugin.stores.get('player-store').set('activePlayer', 'none');
    }
    const handleEnded = () => {
        if (!globalConf.loop) goBack();
        else {
            setConfig({...initialConfig, state: 'playing' });
            playVideo(true);
        }
    }
    
    const handleError = () => {
        setError('An unkown error occured.');
    }
    useEffect(() => {
        window.addEventListener('unhandledrejection', (e) => {
            console.log('error: ', e);
            setError('An unhandled rejection caused the app to crash.')
        })
    }, []);
    
    return (
        <div className="player">
            {/* player */}
            <ReactPlayer
                width='100%'
                height='100%'
                id="test"
                url={link}
                muted={false}
                volume={volume}
                ref={playerEl}
                onProgress={handleOnProgress}
                onPlay={handleOnPlay}
                onDuration={() => {
                    setLoaded(true);
                }}
                onEnded={handleEnded}
                onError={handleError}
                controls={false}
            />
            {/* disable interactions with the player */}
            {started && <div className='overlay' onClick={togglePlayer}></div>}
            {/* modal to start or join the watchparty */}
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
            {/* controls */}
            {
                started &&
                <Controls
                    goBack={goBack}
                    onChange={onSeekChange}
                    onMouseDown={onSeekDown}
                    volume={volume}
                    onVolumeChange={handleVolume}
                    onMouseUp={onSeekUp}
                    config={config}
                    duration={playerEl?.current?.getDuration() ?? 0}
                    onPause={() => pauseVideo()}
                    onPlay={() => playVideo()}
                />
            }
            
        </div>
    )
}

export default Player
