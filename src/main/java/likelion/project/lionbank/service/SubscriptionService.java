package likelion.project.lionbank.service;

import likelion.project.lionbank.domain.Subscription;
import likelion.project.lionbank.dto.SubscriptionRequest;
import likelion.project.lionbank.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import likelion.project.lionbank.common.exception.*;
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
}
