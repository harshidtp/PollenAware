# User Service Use Cases

## UC-01 — Create User Profile

**Actor:** User

**Goal:** Create a PollenAware user profile.

**Main Flow:**

1. User provides profile information.
2. User Service validates the information.
3. User Service creates the user profile.
4. User Service stores the profile in its database.
5. System returns confirmation.

**Postcondition:**
A user profile is created and stored.

---

## UC-02 — View User Profile

**Actor:** User

**Goal:** View their profile information.

**Main Flow:**

1. User requests their profile.
2. User Service identifies the user.
3. User Service retrieves the profile.
4. Profile information is returned.

---

## UC-03 — Update User Profile

**Actor:** User

**Goal:** Update their profile information.

**Main Flow:**

1. User submits updated profile information.
2. User Service validates the information.
3. User Service updates the profile.
4. Updated information is stored.
5. Confirmation is returned.

---

## UC-04 — Manage Allergy Profile

**Actor:** User

**Goal:** Add or update allergy information.

**Main Flow:**

1. User submits allergy information.
2. User Service validates the information.
3. Allergy information is stored.
4. `AllergyProfileUpdated` is published.

---

## UC-05 — Manage User Preferences

**Actor:** User

**Goal:** Manage location and notification preferences.

**Main Flow:**

1. User submits preference changes.
2. User Service validates the information.
3. Preferences are stored.
4. Confirmation is returned.

## System Sequence Diagrams

The User Service system sequence diagrams define the interactions
between the User and User Service for the following use cases:

- SSD-01 — Create User Profile
- SSD-02 — View User Profile
- SSD-03 — Update User Profile
- SSD-04 — Manage Allergy Profile
- SSD-05 — Manage User Preferences

The diagrams are stored in the `diagrams` directory.
