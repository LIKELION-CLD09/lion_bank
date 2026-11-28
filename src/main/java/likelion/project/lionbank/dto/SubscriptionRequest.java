package likelion.project.lionbank.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;

@Getter
public class SubscriptionRequest {

    @NotNull
    private Long accountId;

    @NotBlank
    @Size(max=100)
    private String productName;

    @NotNull @Positive
    private Long amount;

    @NotNull @Min(1) @Max(31)
    private Integer billingAnchorDate;
}
