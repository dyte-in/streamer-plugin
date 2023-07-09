import React, { useContext, useEffect } from 'react'
import './controls.css'
import { PlayerConfig } from '../../pages/player/Player';
import Icon from '../icon/Icon';
import { MainContext } from '../../context';

interface ControlsProps {
    onPlay: () => void;
    onPause: () => void;
    onVolumeChange: (e: any) => void;
    config: PlayerConfig;
    duration: number;
    onMouseDown: (e: any) => void;
    onChange: (e: any) => void;
    onMouseUp: (e: any) => void;
    volume: number;
    goBack: any;
}
const Controls = (props: ControlsProps) => {
    const { globalConf } = useContext(MainContext);
    const {
        volume,
        goBack,
        onMouseUp,
        onChange,
        onMouseDown,
        duration,
        config,
        onVolumeChange,
        onPlay,
        onPause
    } = props;

    const formatTime = (seconds: number) => {
        if (seconds < 3600) return new Date(seconds * 1000).toISOString().substring(14, 19)
        return new Date(seconds * 1000).toISOString().substring(11, 16)
    }

    function handleInputChange(e: any) {
        let target = e.target
        if (e.target.type !== 'range') {
          target = document.getElementById('range')
        } 
        const min = target.min
        const max = target.max
        const val = target.value
        
        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
    }

    useEffect(() => {
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach((input: Element) => {
            handleInputChange({target: input});
            input.addEventListener('input', handleInputChange)
        })

        return () => {
            rangeInputs.forEach((input: Element) => {
                input.removeEventListener('input', handleInputChange)
            })
        }
    }, [config?.played, volume])

    const toggleVolume = () => {
        if (volume === 0) onVolumeChange({ target: { value: 1 }});
        else onVolumeChange({ target: { value: 0 }})
    }

    return (
        <div className='controls'>
            {
                config.state === 'playing'
                ? <Icon className='control-icon' icon='pause' onClick={onPause} />
                : <Icon className='control-icon' icon='play' onClick={onPlay} />
            }
            <div className="volume-manager">
                <Icon onClick={toggleVolume} className='control-icon' icon={volume === 0 ? 'mute' : 'volume'} />
                <input 
                    className="range-control volume-control"
                    type='range'
                    min={0}
                    max={1}
                    step='any'
                    value={volume}
                    onChange={onVolumeChange}
                />
            </div>
            <input
                className="range-control"
                type='range' min={0} max={0.999999} step='any'
                value={config.played}
                onMouseDown={onMouseDown}
                onChange={onChange}
                onMouseUp={onMouseUp}
            />
            <div className="control-time">
                {formatTime(config.playedSeconds)} / {formatTime(duration)}
            </div>
            {!globalConf.hideBack && <Icon onClick={goBack} className='control-icon' icon='dismiss' />}
        </div>
    )
}

export default Controls
