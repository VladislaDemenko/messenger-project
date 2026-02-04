package com.messenger.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Имя для чата обязательно")
    @Column(nullable = false)
    private String name;

    @Column(name = "avatar_color")
    private String avatarColor;

    @Column(name = "chat_type")
    @Enumerated(EnumType.STRING)
    private ChatType type = ChatType.PRIVATE;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "chat_participants",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> participants = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "chat", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Message> messages = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (avatarColor == null) {
            String[] colors = {"#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#6f42c1"};
            avatarColor = colors[(int) (Math.random() * colors.length)];
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addParticipant(User user) {
        this.participants.add(user);
        user.getChats().add(this);
    }

    public void removeParticipant(User user) {
        this.participants.remove(user);
        user.getChats().remove(this);
    }

    public boolean isParticipant(User user) {
        return this.participants.contains(user);
    }

    public String getDisplayNameForUser(User user) {
        if (type == ChatType.PRIVATE) {
            return participants.stream()
                    .filter(p -> !p.getId().equals(user.getId()))
                    .findFirst()
                    .map(User::getUsername)
                    .orElse(this.name);
        }
        return this.name;
    }
}
