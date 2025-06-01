import { Sparkles } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="my-2 ml-4 flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">QuizAI</div>
            </div>
        </>
    );
}
