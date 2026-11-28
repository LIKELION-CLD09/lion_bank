package likelion.project.lionbank.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SubscriptionUpdateRequest {

    private Long accountId;

    @Size(max = 100)
    private String productName;

    @Positive
    private Long amount;

    @Min(1) @Max(31)
    private Integer billingAnchorDate;
}
