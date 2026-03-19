package com.forum.service;

import com.forum.dto.CommentDTO;
import com.forum.dto.CreateCommentRequest;
import com.forum.model.Comment;
import com.forum.model.Post;
import com.forum.model.User;
import com.forum.repository.CommentRepository;
import com.forum.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AuthService authService;

    public List<CommentDTO> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdAndParentIsNull(postId).stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDTO createComment(Long postId, CreateCommentRequest request, String username) {
        User user = authService.getUserByUsername(username);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .post(post)
                .build();

        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }

        comment = commentRepository.save(comment);
        return CommentDTO.fromEntity(comment);
    }

    @Transactional
    public void deleteComment(Long id, String username) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}