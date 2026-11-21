**What works:** every route loads directly, on reload and with back/forward. There's no horizontal overflow at any of the 5 viewports, in English or in Bosnian (the default), and no console errors, failed requests or broken images. All 98 product photos load. The "Get your piece" drawer works end to end:

- it opens from all five triggers;
- validation messages match each case;
- tagging and notes work;
- one EmailJS call goes out (mocked) with an email that has absolute image URLs;
- failure and retry work on both desktop and phone;
- double-submit is blocked and unsent input is kept.

Catalogue filtering, "Show more" and Back restoration work. So do the phone piece sheet (open, step, close by ✕, Escape, Back and pull-down), the compact and phone menus, the FAQ accordion and the API-down page with retry. The admin can't be entered without the password.

**What needs attention:**

1. On phones, the piece sheet lets keyboard focus escape to the page behind it.
2. On phones, one piece ("Shirt & trousers") can't be found through any type filter.
3. Small grey text (catalogue categories, product labels, the inactive language button) fails contrast.
4. The home news carousel ignores reduced motion.
5. A couple of catalogue URL edge cases empty the grid, and the reply-time promise contradicts itself.

There are no critical issues. Triage verdicts below come from re-running every failure and checking the source. "Not a bug" items (sticky or modal overlap by design, test timing) are excluded.
