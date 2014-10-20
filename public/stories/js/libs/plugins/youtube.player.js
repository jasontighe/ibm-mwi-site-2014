/*
 Copyright 2012 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

define(['App','jquery'], function(App, $) {
  App.YTPlayer =
  {
    players: new Array(),

    playVideo: function(container, videoId, w, h) 
    {
      if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') 
      {
        // console.log( "YTPLAYER : YT IS UNDEFINED." );
        window.onYouTubeIframeAPIReady = function() 
        {
          // console.log( "YTPLAYER : PLAYER is READY" );
          App.YTPlayer.loadPlayer(container, videoId, w, h);
        };

        $.getScript('//www.youtube.com/iframe_api');
      } 
      else 
      {
        // console.log( "YTPLAYER : PLAYER is LOAD PLAYER" );
        App.YTPlayer.loadPlayer(container, videoId, w, h);
      }
    },

    loadPlayer: function(container, videoId, w, h) 
    {
      
      console.log( "YTPLAYER: loadPlayer() : App.YTPlayer is ",App.YTPlayer);
      console.log( "YTPLAYER: loadPlayer() : this is ",this);
      console.log( "YTPLAYER: loadPlayer() : container is ",container);
      console.log( "YTPLAYER: loadPlayer() : videoId is ",videoId);
      console.log( "YTPLAYER: loadPlayer() : w is ",w);
      console.log( "YTPLAYER: loadPlayer() : h is ",h);
      

      // Check if video has been played before,
      if(  App.YTPlayer.hasPlayer(videoId) )
      {
        console.log( "YTPLAYER: loadPlayer() : App.YTPlayer.hasPlayer(videoId) is ",App.YTPlayer.hasPlayer(videoId));
        var player =  App.YTPlayer.getPlayerByVideoId(videoId);
        player.playVideo();
      }
      // If no make a new one and then add it to the players array
      else
      {
        this.player = new YT.Player(container, 
        {
          videoId: videoId,
          width: w,
          height: h,
          playerVars: 
          {
            autoplay: 1,
            controls: 1,
            modestbranding: 0,
            rel: 0,
            showInfo: 0,
            enablejsapi: 1
          },
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          }
        });

        // Hard set videoId to ytPlayer so that you can retrieve it on events
        this.player.videoId = videoId;
        // Add player to players arrray
        App.YTPlayer.players.push({
          "player": this.player,
          "videoId": videoId,
          "currentState": -1
        })
      };
    },
    
    // Check if there is a player for the videoId
    hasPlayer: function(videoId) 
    { 
      for( i = 0; i < App.YTPlayer.players.length; i++ )
      {
        if(  App.YTPlayer.players[ i ].videoId === videoId )  return true;
      }
      return false;
    },

    totalPlayersPerId: function(videoId)
    {
      var totalPlayers = 0;
      for( i = 0; i < App.YTPlayer.players.length; i++ )
      {
        if(  App.YTPlayer.players[ i ].videoId === videoId ) totalPlayers++;
      }

      return totalPlayers
    },

    // If the player has been instantiated, retreive it by videoId
    getPlayerByVideoId: function(videoId)
    {
      var player;
      for( i = 0; i <  App.YTPlayer.players.length; i++ )
      {
        player =  App.YTPlayer.players[ i ].player;
        if(  App.YTPlayer.players[ i ].videoId == videoId )  return player;
      }
      return player;
    },

    setCurrentState: function(videoId, state)
    {
      // console.log('YTPLAYER: onPlayerStateChange(): videoId: '+videoId);
      // console.log('YTPLAYER: onPlayerStateChange(): state: '+state);
      var player;
      for( i = 0; i <  App.YTPlayer.players.length; i++ )
      {
        player =  App.YTPlayer.players[ i ].player;
        if(  App.YTPlayer.players[ i ].videoId == videoId )
        {
          App.YTPlayer.players[ i ].currentState = state;
        }
      }
    },
    
    pauseOtherPlayers: function(videoId)
    {
      var player;
      for( i = 0; i <  App.YTPlayer.players.length; i++ )
      {
        // console.log('YTPLAYER: onPlayerStateChange(): currentState: '+YTPlayer.players[ i ].currentState);
        player =  App.YTPlayer.players[ i ].player;
        if(  App.YTPlayer.players[ i ].videoId != videoId )
        {
          if(  App.YTPlayer.players[ i ].currentState == 1 )
          {
              player.pauseVideo();
          }
          else if(  App.YTPlayer.players[ i ].currentState == 3 )
          {
            player.stopVideo();
          }
        }
      }
    },

    stopAllPlayers: function()
    {
      var player;
      for( i = 0; i <  App.YTPlayer.players.length; i++ )
      {
        // console.log('YTPLAYER: onPlayerStateChange(): currentState: '+YTPlayer.players[ i ].currentState);
        player =  App.YTPlayer.players[ i ].player;

        player.stopVideo();
        // App.trigger('VideoEvent.COMPLETE'+'-'+App.YTPlayer.players[ i ].videoId, App.YTPlayer.players[ i ].videoId);
      }
    },

    onPlayerReady: function() {},

    onPlayerStateChange: function(event) 
    {
      /* YOUTUBE PLAYER EVENTS: https://developers.google.com/youtube/js_api_reference#Events
      -1 (unstarted)
      0 (ended) - YT.PlayerState.ENDED
      1 (playing) - YT.PlayerState.PLAYING
      2 (paused) - YT.PlayerState.PAUSED
      3 (buffering) - YT.PlayerState.BUFFERING
      5 (video cued) - YT.PlayerState.CUED
      When the player first loads a video, it will broadcast an unstarted (-1) event. 
      When a video is cued and ready to play, the player will broadcast a video cued (5) event. 
      */
      // console.log('');
      console.log('YTPLAYER: onPlayerStateChange(): state:'+event.data+', videoId: '+event.target.videoId);
      // Save current player state so that you can check if its playing while another starts.
      App.YTPlayer.setCurrentState(event.target.videoId, event.data);

      if (event.data === YT.PlayerState.PLAYING) 
      {
        App.YTPlayer.pauseOtherPlayers(event.target.videoId)
        // console.log('YTPLAYER: onPlayerStateChange(): totalPlayersPerId(event.target.videoId):'+App.YTPlayer.totalPlayersPerId(event.target.videoId));
      }

      // On Video Complete Event
      else if( event.data === 0  )
      {
        // console.log('YTPLAYER: onPlayerStateChange(): VideoEvent.COMPLETE - event: ',event );
        App.trigger('VideoEvent.COMPLETE'+'-'+event.target.videoId, event.target.videoId);
      }
    },

    stopVideo: function() {
      // console.log('YTPLAYER: stopVideo()');
      player.stopVideo();
    },

    /** All of the following are shims of YouTube's JavaScript API.
     *  For more info see: https://developers.google.com/youtube/iframe_api_reference
     **/
    getTime: function() 
    {
      if ( App.YTPlayer) {
        App.YTPlayer.getCurrentTime();
      }
    },

    seekTo: function(seconds, allowSeekAhead) 
    {
      if ( App.YTPlayer)
      {
        App.YTPlayer.seekTo(seconds, allowSeekAhead);
      }
    },

    getPlayerState: function() 
    {
      if ( App.YTPlayer)
      {
        App.YTPlayer.getPlayerState();
      }
    }
  };

  return  App.YTPlayer;
});