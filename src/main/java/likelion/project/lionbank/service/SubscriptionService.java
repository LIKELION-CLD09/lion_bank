package likelion.project.lionbank.service;

import likelion.project.lionbank.domain.Subscription;
import likelion.project.lionbank.dto.SubscriptionRequest;
import likelion.project.lionbank.dto.SubscriptionResponse;
import likelion.project.lionbank.dto.SubscriptionUpdateRequest;
import likelion.project.lionbank.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import likelion.project.lionbank.common.exception.*;

import java.util.List;
// AccountRepository import 추가 예정
// UserRepository import 추가 예정
// Account Entity import 추가 예정
// User Entity import 추가 예정

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    // Subscription 생성 메서드
    @Transactional
    public long create(SubscriptionRequest req, String username) {
        Account account = checkAccount(req.getAccountId(), username);
        Subscription subscription = Subscription.builder()
                .account(account)
                .productName(req.getProductName())
                .amount(req.getAmount())
                .billingAnchorDate(req.getBillingAnchorDate())
                .build();
        return subscriptionRepository.save(subscription).getId();
    }

    // Subscription 수정 메서드
    @Transactional
    public void update(long subscriptionId, SubscriptionUpdateRequest req, String username) {
        Subscription subscription = checkSubscription(subscriptionId, username);
        if (req.getAccountId() != null) {
            subscription.setAccount(checkAccount(req.getAccountId(), username));
        }
        if (req.getProductName() != null) {
            subscription.setProductName(req.getProductName());
        }
        if (req.getAmount() != null) {
            subscription.setAmount(req.getAmount());
        }
        if (req.getBillingAnchorDate() != null) {
            subscription.setBillingAnchorDate(req.getBillingAnchorDate());
        }
    }

    // Subscription 삭제 메서드
    @Transactional
    public void delete(long subscriptionId, String username) {
        checkSubscription(subscriptionId, username).setStatus("DELETED");
    }

    // Subscription 목록 조회 메서드
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getList(String username) {
        return subscriptionRepository.findByAccountUserUsernameAndStatus(username, "ACTIVE")
                .stream()
                .map(SubscriptionResponse::new)
                .toList();
    }

    // 본인의 계좌인지, ACTIVE 상태의 존재하는 계좌인지 확인하는 메서드
    private Account checkAccount(long accountId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("계좌를 찾을 수 없습니다."));
        if (!account.getUser().getId().equals(user.getId())) throw new ForbiddenException("본인 계좌가 아닙니다.");
        if (!"ACTIVE".equals(account.getStatus())) throw new IllegalArgumentException("활성화되지 않은 계좌입니다.");
        return account;
    }

    // 해당 정기 구독이 사용자의 정기 구독인지 확인하는 메서드
    private Subscription checkSubscription(long subscriptionId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new NotFoundException("정기 구독을 찾을 수 없습니다."));
        if (!subscription.getAccount().getUser().getId().equals(user.getId())) throw new ForbiddenException("본인의 구독이 아닙니다.");
        if (!"ACTIVE".equals(subscription.getStatus())) throw new IllegalArgumentException("삭제된 정기 구독입니다.");
        return subscription;
    }
}
