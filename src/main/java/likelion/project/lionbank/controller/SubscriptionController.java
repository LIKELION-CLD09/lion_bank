package likelion.project.lionbank.controller;

import jakarta.validation.Valid;
import likelion.project.lionbank.dto.SubscriptionRequest;
import likelion.project.lionbank.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import likelion.project.lionbank.common.ApiResponse;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // Subscription 생성 endpoint
    @PostMapping
    public ApiResponse<Long> createSubscription(@Valid @RequestBody SubscriptionRequest req,
                                                @AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(subscriptionService.create(req, user.getUsername()));
    }
}
