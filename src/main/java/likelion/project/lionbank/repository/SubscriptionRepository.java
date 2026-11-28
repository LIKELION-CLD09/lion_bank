package likelion.project.lionbank.repository;

import likelion.project.lionbank.domain.Subscription;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @EntityGraph(attributePaths = "account")
    List<Subscription> findByAccountUserUsernameAndStatus(String username, String status);
}
