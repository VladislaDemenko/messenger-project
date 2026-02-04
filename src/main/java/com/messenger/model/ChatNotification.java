package com.messenger.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatNotification {
    private Long id;
    private String content;
    private Long senderId;
    private String senderName;
    private Long chatId;
    private String chatName;
    private LocalDateTime timestamp;
    private MessageType type;
    private boolean isGroupChat;

    public ChatNotification(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.senderId = message.getSender().getId();
        this.senderName = message.getSender().getUsername();
        this.chatId = message.getChat().getId();
        this.chatName = message.getChat().getName();
        this.timestamp = message.getCreatedAt();
        this.type = message.getType();
        this.isGroupChat = message.getChat().getType() == ChatType.GROUP;
    }
}