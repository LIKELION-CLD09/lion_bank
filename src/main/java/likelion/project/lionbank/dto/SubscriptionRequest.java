package likelion.project.lionbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SubscriptionRequest {

    @NotBlank
    private long accountId;

    @NotBlank
    @Size(max=100)
    private String productName;

    @NotBlank
    private long amount;

    @NotBlank
    private int billingAnchorDate;
}
