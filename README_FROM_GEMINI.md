Part 2: UPDATE AUTHCONTEXT WITH QUIZ FUNCTIONS is complete.

<br>
Here's a summary of the changes:
- Added `addCreatedQuiz`, `updateQuiz`, and `deleteCreatedQuiz` functions to `src/contexts/AuthContextProvider.tsx`.
- Included these new functions in the `AuthContext.Provider` value in `src/contexts/AuthContextProvider.tsx`.
- Updated `AuthContextType` in `src/types/index.ts` to include the new quiz management functions.
- Removed the hardcoded `quizzes` from the `mockUser` object in `src/contexts/AuthContextProvider.tsx` to provide a clean slate for testing quiz creation.

<br>
Now, I am ready for the next instruction.