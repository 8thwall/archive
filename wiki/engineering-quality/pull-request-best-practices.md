# Pull Request Best Practices

As 8th Wall grows, code reviews will become much more common. This document will outline some practices to follow when both sending a pull request for review, and when reviewing pull requests.

# Sending a Pull Request

## Self-Review your Pull Request

Always, always, always take a look at your own pull request before requesting review from others. This is your opportunity to catch simple mistakes, syntax errors, lint errors, etc. Your ultimate goal is typically to get your pull request approved as quickly as possible, and fixing these types of mistakes before requesting review helps avoid unnecessary churn.

## Provide Context

You may feel like your PR is easy to understand, but that is almost certainly because you have already put significant thought into the problem and have an understanding about why your changes are necessary. Unless you have had a conversation with the reviewer offline before requesting review, the reviewer does not have the same amount of context. The context you provide should answer the following questions:

 * Why is this PR needed?

 * What are you trying to solve in this PR?

 * How does this PR accomplish this?

### Examples

## Provide Screenshots for UI Changes

Reviewers don’t have a built-in compiler in their heads that lets them see what your code looks like. You also shouldn’t expect reviewers to checkout a copy of your branch and view your changes locally. How can you expect good feedback on your PR if you don’t provide examples of what the UI you built looks like?

_Reviewers when they are asked to review a PR without screenshots_

### Extra Credit: Provide Screenshots of Mocks

Sometimes, your reviewer might not know what the expected design / mock for the UI you’re building should look like. It could be that your code looks great to the reviewer, but it’s completely different than what the designer was expecting. Providing a screenshot of the expectation can be really helpful in reducing churn on your feature development.

### Examples

## Provide a Test Plan

You need to convince the reviewer that your changes are safe. The best way to do so is to include the steps you took to test your changes! Did you manually test it? What steps were taken during that manual test? If there are unit tests, what command should another person run to execute those tests?

Code review should not be your test plan. A good test plan can fall into two different categories:

 * **Unit Tests:** Self-explanatory. The unit test is verifying the behavior of the code. For the test plan, you can just include the commands to run the unit test.

 * **Manual Testing:** For code paths that don’t already have an easy way to test. Generally, this is the UI changes we make. In these cases, provide the steps you took to ensure that your code was tested.

### Examples

**Unit Test:**
**Manual Test:**

## Pull Requests Should Be Small

<https://twitter.com/iamdevloper/status/397664295875805184>

Large PRs also have the bad side effect of keeping code from being landed that is already vetted because they are being held up by comments on an unrelated piece of code. The longer the time between when your write something and it gets landed, the more chance it has for merge conflict, or to no longer be correct by the time you land it. The goal should be to get smaller chunks of code landed faster, always without breaking anything along the way.

### Large PR Red Flags

Now you may be thinking, “how exactly do I know if a PR is too large?”. There are a couple red flags that are indicative of a PR being too big.

#### Focuses On Multiple Ideas

Keeping your PR focused on a single idea is an easy way to ensure it stays small. For example, imagine a PR with the following title:

`[xrhome] Renamed ProfilePageComponent and Added Profile Image Customization`

When looking at this PR, a reviewer would now need to ensure:

 1. All references of ProfilePageComponent have been renamed properly.

 2. Understand all profile image customization logic.

By coupling these two ideas together into a single PR, each will be unnecessarily blocked by the other if the reviewer decides to request changes. This makes you much more susceptible to merge conflicts by the time your PR has been approved.

#### Over 200 Lines Added

This is very much a rule of thumb. Not every 200 line PR is large, especially if it includes unit tests or generated code. A 200 line PR, however, does take significant time to review thoroughly. As such, you should definitely ask yourself whether your PR can be broken up into multiple PRs when crossing the 200 line threshold.

### Break Large Features into Multiple PRs

PRs take time to review, and context switching is difficult. Breaking your large features into multiple PRs will not only make it easier for your reviewers to fully understand any single PR, but it will also get your PRs reviewed faster! It is much easier for reviewers to find multiple 15-30 minute blocks in the day to review a small PR, then to find a single 1 hour block to review a large PR.

### Good Examples

Focuses on a Single Idea:
Small start for a larger feature:

### Bad Examples

Focusing on Multiple Ideas:
Too Large. Implements entire feature:

## Don’t Request Review From Too Many People

You may have been warned about the [Bystander effect](<https://en.wikipedia.org/wiki/Bystander_effect>), and to explicitly tell someone to call 911 during an emergency. A similar concept applies to code reviews.

When selecting reviewers for your PR, you should choose the people you expect to give the best feedback. This can either be someone who has the most context in the project your working on, or someone who is an expert in a certain language or technology you’re using. If many people fit those requirements, limit your selection to no more than 2-3 people. Anything more, and you’ll end up in a scenario where no one reviews your code because they each assume someone else will do it.

## Resolving Comments

When a reviewer makes a comment, please leave it for the reviewer to dismiss. This is faster for the reviewer so they can remember what their comments were from last review, and also allows the reviewer to ensure the comment was addressed to their satisfaction. Adding a or a message indicating how the comment was addressed can be productive here.

# Reviewing a Pull Request

## Don’t be Afraid of Requesting Changes

It is best to be explicit in your reviews of a PR. All too often do I see pull request reviewers simply leaving comments. Does that mean you’re approving of the PR, but want minor changes made? Does that mean you want changes to be made to the PR? I have no idea.

When submitting a review to a PR, you should always do one of the following: approve or request changes. This makes it very clear to the sender what your thoughts on the PR are. I like to think of approve and request changes as the following:

 * **Approve:** I, as a reviewer, approve of the changes requested. If I have suggestions for minor improvements that can be made before merging, I can explicitly mention those in comments. I, however, trust that the sender can make these changes, and I will not look at the PR again.

 * **Request Changes:** I have questions / comments / concerns, and expect a response from the sender. I fully intend to look at this PR again after the comments are addressed.

## Be Explicit About Why You Request Changes

Don’t let the sender be confused about why you are requesting changes on their PR. Otherwise, the PR will go through unnecessary iterations, costing both you and the sender extra time. By telling the sender exactly what you expect to change, or what questions you expect to be answered, you can both quickly make progress on the PR.

### Examples

## Provide Offline Conversation TL;DRs in Comments

This goes back to the idea of providing context. When conversations happen offline, it’s good to provide a quick summary of what was learned during those offline conversations in the comments of the PR. Not only will help other reviewers who weren’t part of the conversation better understand the pull request, but it will help others on the team understand why decisions were made if they ever decide to look back at PRs merged in the past.

### Examples

