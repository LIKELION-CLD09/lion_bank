package likelion.project.lionbank.dto;

import likelion.project.lionbank.domain.Subscription;
import lombok.Getter;

@Getter
public class SubscriptionResponse {

    private final Long id;
    private final Long accountId;
    private final String accountName;
    private final String productName;
    private final Long amount;
    private final Integer billingAnchorDate;

    public SubscriptionResponse(Subscription s) {
        this.id = s.getId();
        this.accountId = s.getAccount().getId();
        this.accountName = s.getAccount().getAccountName();
        this.productName = s.getProductName();
        this.amount = s.getAmount();
        this.billingAnchorDate = s.getBillingAnchorDate();
    }
}
