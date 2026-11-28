package likelion.project.lionbank.controller;

import jakarta.validation.Valid;
import likelion.project.lionbank.dto.SubscriptionRequest;
import likelion.project.lionbank.dto.SubscriptionUpdateRequest;
import likelion.project.lionbank.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
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

    // Subscription 수정 endpoint
    @PatchMapping("/{subscriptionId}")
    public ApiResponse<Void> updateSubscription(@Valid @RequestBody SubscriptionUpdateRequest req,
                                                @PathVariable Long subscriptionId,
                                                @AuthenticationPrincipal UserDetails user) {
        subscriptionService.update(subscriptionId, req, user.getUsername());
        return ApiResponse.ok(null);
    }

    // Subscription 삭제 endpoint
    @DeleteMapping("/{subscriptionId}")
    public ApiResponse<Void> deleteSubscription(@PathVariable Long subscriptionId,
                                                @AuthenticationPrincipal UserDetails user) {
        subscriptionService.delete(subscriptionId, user.getUsername());
        return ApiResponse.ok(null);
    }
}
