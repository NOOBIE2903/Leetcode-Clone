import React from 'react';

function Comment({ comment, onReply, isTopLevel }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <p className="font-bold text-white">{comment.author}</p>
        <p className="text-xs text-gray-400 ml-4">{new Date(comment.createdAt).toLocaleString()}</p>
      </div>
      <p className="text-gray-300 mb-2">{comment.content}</p>
      
      {isTopLevel && (
        <button onClick={() => onReply(comment.id)} className="text-xs text-blue-400 hover:underline">
          Reply
        </button>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-gray-700 space-y-4">
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;