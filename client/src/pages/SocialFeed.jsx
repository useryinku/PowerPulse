import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { 
  FavoriteOutlined, 
  FavoriteBorderOutlined, 
  ChatBubbleOutlineOutlined, 
  ShareOutlined,
  MoreVertOutlined,
  PhotoCameraOutlined
} from '@mui/icons-material';

const Container = styled.div`
  flex: 1;
  height: 100%;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  justify-content: flex-start;
  padding: 0px 16px;
  margin: 0 auto;
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const PostCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CreatePostCard = styled(PostCard)`
  margin-bottom: 8px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
`;

const PostTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const PostContent = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  line-height: 1.5;
  margin: 8px 0;
`;

const PostImage = styled.img`
  width: 100%;
  border-radius: 8px;
  max-height: 400px;
  object-fit: cover;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme, active }) => active ? theme.primary : theme.text_secondary};
  
  &:hover {
    background: ${({ theme }) => theme.text_secondary + 10};
    color: ${({ theme }) => theme.primary};
  }
`;

const ActionText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const CreatePostInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  resize: vertical;
  outline: none;
  font-family: inherit;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const PostButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.secondary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreatePostActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MediaButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  color: ${({ theme }) => theme.text_secondary};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const CommentsSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + 20};
`;

const Comment = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const CommentContent = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.bg};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-right: 8px;
`;

const CommentText = styled.span`
  color: ${({ theme }) => theme.text_primary};
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 20px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 13px;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const SocialFeed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        username: "@sarahfit"
      },
      content: "Just completed my first 5K run! 🏃‍♀️ The training with PowerPulse really paid off. Feeling stronger every day! #fitness #running #goals",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      timestamp: "2 hours ago",
      likes: 24,
      isLiked: false,
      comments: [
        { id: 1, author: "Mike Chen", content: "Congratulations! That's amazing progress! 🎉" },
        { id: 2, author: "Emma Wilson", content: "You're such an inspiration! Keep it up! 💪" }
      ],
      showComments: false
    },
    {
      id: 2,
      author: {
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        username: "@alexfitness"
      },
      content: "New PR on deadlifts today! 💪 Hit 315lbs for 3 reps. The progressive overload approach is working wonders. Thanks to everyone in this community for the motivation!",
      timestamp: "4 hours ago",
      likes: 18,
      isLiked: true,
      comments: [
        { id: 1, author: "David Kim", content: "Beast mode! 🔥" },
        { id: 2, author: "Lisa Park", content: "That's incredible! What's your training split?" }
      ],
      showComments: false
    },
    {
      id: 3,
      author: {
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        username: "@mayawellness"
      },
      content: "Meal prep Sunday! 🥗 Prepared healthy meals for the entire week. Consistency is key to reaching our fitness goals. What's your favorite meal prep recipe?",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
      timestamp: "6 hours ago",
      likes: 31,
      isLiked: false,
      comments: [
        { id: 1, author: "Tom Wilson", content: "Looks delicious! Could you share the recipe?" }
      ],
      showComments: false
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [newComments, setNewComments] = useState({});

  const currentUser = {
    name: "FitWarrior2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          username: "@" + currentUser.name.toLowerCase()
        },
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
        comments: [],
        showComments: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    const commentText = newComments[postId];
    if (commentText && commentText.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: post.comments.length + 1,
              author: currentUser.name,
              content: commentText
            }],
            showComments: true
          };
        }
        return post;
      }));
      setNewComments({ ...newComments, [postId]: '' });
    }
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    }));
  };

  const handleCommentInputChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  return (
    <Container>
      <Wrapper>
        <Title>🌟 Fitness Community</Title>
        
        {/* Create Post Section */}
        <CreatePostCard>
          <UserInfo>
            <Avatar src={currentUser.avatar} sx={{ width: 40, height: 40 }}>
              {currentUser.name[0]}
            </Avatar>
            <UserDetails>
              <UserName>{currentUser.name}</UserName>
            </UserDetails>
          </UserInfo>
          
          <CreatePostInput
            placeholder="Share your fitness journey, achievements, or tips with the community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          
          <CreatePostActions>
            <MediaButton>
              <PhotoCameraOutlined sx={{ fontSize: 18 }} />
              Add Photo
            </MediaButton>
            <PostButton 
              onClick={handleCreatePost}
              disabled={!newPost.trim()}
            >
              Share Post
            </PostButton>
          </CreatePostActions>
        </CreatePostCard>

        {/* Posts Feed */}
        {posts.map((post) => (
          <PostCard key={post.id}>
            <PostHeader>
              <UserInfo>
                <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }}>
                  {post.author.name[0]}
                </Avatar>
                <UserDetails>
                  <UserName>{post.author.name}</UserName>
                  <PostTime>{post.timestamp}</PostTime>
                </UserDetails>
              </UserInfo>
              <MoreVertOutlined sx={{ color: 'text_secondary', cursor: 'pointer' }} />
            </PostHeader>

            <PostContent>{post.content}</PostContent>
            
            {post.image && <PostImage src={post.image} alt="Post content" />}

            <PostActions>
              <ActionButton 
                active={post.isLiked}
                onClick={() => handleLike(post.id)}
              >
                {post.isLiked ? 
                  <FavoriteOutlined sx={{ fontSize: 20 }} /> : 
                  <FavoriteBorderOutlined sx={{ fontSize: 20 }} />
                }
                <ActionText>{post.likes}</ActionText>
              </ActionButton>

              <ActionButton onClick={() => toggleComments(post.id)}>
                <ChatBubbleOutlineOutlined sx={{ fontSize: 20 }} />
                <ActionText>{post.comments.length}</ActionText>
              </ActionButton>

              <ActionButton>
                <ShareOutlined sx={{ fontSize: 20 }} />
                <ActionText>Share</ActionText>
              </ActionButton>
            </PostActions>

            {/* Comments Section */}
            {post.showComments && (
              <CommentsSection>
                {post.comments.map((comment) => (
                  <Comment key={comment.id}>
                    <Avatar sx={{ width: 28, height: 28 }}>
                      {comment.author[0]}
                    </Avatar>
                    <CommentContent>
                      <CommentAuthor>{comment.author}</CommentAuthor>
                      <CommentText>{comment.content}</CommentText>
                    </CommentContent>
                  </Comment>
                ))}
                
                <CommentInputContainer>
                  <Avatar src={currentUser.avatar} sx={{ width: 28, height: 28 }}>
                    {currentUser.name[0]}
                  </Avatar>
                  <CommentInput
                    placeholder="Write a comment..."
                    value={newComments[post.id] || ''}
                    onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(post.id);
                      }
                    }}
                  />
                  <PostButton 
                    onClick={() => handleComment(post.id)}
                    disabled={!newComments[post.id]?.trim()}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Post
                  </PostButton>
                </CommentInputContainer>
              </CommentsSection>
            )}
          </PostCard>
        ))}
      </Wrapper>
    </Container>
  );
};

export default SocialFeed;
