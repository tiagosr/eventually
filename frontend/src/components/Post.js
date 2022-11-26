import React, {} from 'react';
import PostContents from './PostContents';

function Post({creator, metadata, content, likes, iLikedThis, onLiked, replies, onReplied}) {

    return (
        <div className='post'>
            <div className='post-creator-avatar'>{creator.avatar}</div>
            <div className='post-creator'>{creator.name}</div>
            <div className='post-creator-handle'>{creator.handle}</div>
            <div className='post-metadata-time'>{metadata.timestamp}</div>
            <div className='post-contents'>
                <PostContents content={content} />
            </div>
            
        </div>
    )
}

export default Post;