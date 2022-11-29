import React, { useState, useEffect } from 'react';
import Post from "./Post";

function Timeline({posts}) {
    return (
        <ul>
            {posts.map(({id, creator, metadata, content, likes, replies}) => <li key={id}>
                    <Post
                        creator={creator}
                        metadata={metadata}
                        content={content}
                        likes={likes}
                        replies={replies}
                    />
                </li>)}
        </ul>
    );
}

export default Timeline;