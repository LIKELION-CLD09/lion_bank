package likelion.project.lionbank.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
// Account Entity import 추가 예정

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="subscriptions")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Installment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Accoint account;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private long totalAmount;

    @Column(nullable = false)
    private int installmentMonths;

    @Column(nullable = false)
    private LocalDate firstPaymentDate;

    @Column(nullable = true)
    private LocalDate delayedDate;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.status = "ACTIVE";
    }
}
