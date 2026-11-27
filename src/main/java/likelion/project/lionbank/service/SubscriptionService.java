package likelion.project.lionbank.service;

import likelion.project.lionbank.domain.Subscription;
import likelion.project.lionbank.dto.SubscriptionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// AccountRepository import 추가 예정
// Account Entity import 추가 예정
// 전역 예외 처리 import 추가 예정

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final AccountRepository accountRepository;

    // Subscription 생성 메서드
    @Transactional
    public long create(SubscriptionRequest req) {
        Account account = checkAccount(req.getAccountId());
        Subscription subscription = Subscription.builder()
                .account(account)
                .productName(req.getProduct_name())
                .amount(req.getAmount())
                .billingAnchorDate(req.getBillingAnchorDate())
                .build();
        return subscriptionRepository.save(subscription).getId();
    }

    // ACTIVE 상태의 존재하는 계좌인지 확인하는 메서드
    private Account checkAccount(long accountId) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("계좌를 찾을 수 없습니다."));
        if (!"ACTIVE".equals(account.getStatus())) throw new IllegalStateException("활성화되지 않은 계좌입니다.");
        return account;
    }

}
