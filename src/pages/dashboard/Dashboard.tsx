import React, { useContext, useState } from 'react';
import './dashboard.css';
import logo from '../../assets/logo.png'
import mp4 from '../../assets/mp4.png';
import vimeo from '../../assets/vimeo.png';
import twitch from '../../assets/twitch.png';
import youtube from '../../assets/youtube.png';
import facebook from '../../assets/facebook.png';
import { Button, Input } from '../../components';
import { MainContext } from '../../context';
import { canPlay } from '../../utils/helpers';

const Dashboard = () => {
    const { plugin, link, setLink, setActivePlayer } = useContext(MainContext);
    const icons = [
       {label: 'Vimeo', icon: vimeo },
       {label: 'Youtube', icon: youtube },
       {label: 'MP4', icon: mp4 },
    //    {label: 'Twitch', icon: twitch },
    //    {label: 'Facebook', icon: facebook },
    ]

    const playVideo = async () => {
        const player = canPlay(link)
        if (player) {
            await plugin.stores.get('player-store').set('url', link);
            await plugin.stores.get('player-store').set('activePlayer', player);
            setActivePlayer(player);
            return;
        }
        console.log('error...')
        // TODO: handle errors
    }
 
    return (
        <div className="dashboard-content">
            <div className="dashboard-flex">
                <span><img src={logo} /> Streamer</span>
                <h3>Watch your favourite videos together</h3>
                &ensp;
                <span>
                    <Input 
                        onKeyDown={(e) => {
                            if (e.code === 'Enter') playVideo();
                        }} 
                        placeholder='Enter your video link.'
                        icon='search'
                        value={link}
                        onChange={(e) => {
                            setLink((e?.target?.value ?? '').trim())
                        }}
                    />
                    <Button onClick={playVideo} variant='primary' icon='play' />
                </span>
            </div>
            <p>Supported players</p>
            <div className="icons">
                {icons.map(({label, icon}, index) => (
                    <img key={index} src={icon} alt={label} />
                ))}
            </div>
        </div>  
    )
}

export default Dashboard
