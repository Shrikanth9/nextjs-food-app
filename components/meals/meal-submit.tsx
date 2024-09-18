import { useFormStatus } from "react-dom";

export default function MealSubmit() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}> 
              {pending ? 'Submitting...' : 'Share meal'}
            </button>
    );
}