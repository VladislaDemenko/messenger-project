package com.messenger.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Message content is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "message_type")
    @Enumerated(EnumType.STRING)
    private MessageType type = MessageType.TEXT;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_read")
    private boolean isRead = false;

    @Column(name = "is_edited")
    private boolean isEdited = false;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;

    @OneToMany(mappedBy = "replyTo", fetch = FetchType.LAZY)
    private Set<Message> replies = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "message_read_by",
            joinColumns = @JoinColumn(name = "message_id"))
    @Column(name = "user_id")
    private Set<Long> readBy = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (this.isEdited) {
            this.isEdited = true;
        }
    }

    public void markAsRead(Long userId) {
        this.readBy.add(userId);
        if (this.readBy.containsAll(getChatParticipantIds())) {
            this.isRead = true;
        }
    }

    public boolean isReadByUser(Long userId) {
        return this.readBy.contains(userId);
    }

    @JsonIgnore
    public Set<Long> getChatParticipantIds() {
        Set<Long> participantIds = new HashSet<>();
        if (chat != null && chat.getParticipants() != null) {
            chat.getParticipants().forEach(user ->
                    participantIds.add(user.getId()));
        }
        return participantIds;
    }
}