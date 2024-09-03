#pragma once

#include <chrono>
#include <thread>

template <typename T>
concept BooleanPredicate = std::invocable<T> && std::same_as<std::invoke_result_t<T>, bool>;

/// Busy wait for the predicate to return true, up to `timeout`, in steps of (roughly) `interval` time.
template <BooleanPredicate Predicate>
[[nodiscard]] bool tryVerify(
    Predicate                                    predicate,
    std::chrono::high_resolution_clock::duration timeout = std::chrono::milliseconds(420),
    std::chrono::high_resolution_clock::duration interval = std::chrono::milliseconds(4)
)
{
    auto begin = std::chrono::high_resolution_clock::now();
    while (std::chrono::high_resolution_clock::now() - begin < timeout)
    {
        if (predicate())
        {
            return true;
        }
        std::this_thread::sleep_for(interval);
    }
    return false;
}