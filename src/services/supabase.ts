import { supabase } from '../lib/supabase';

/**
 * Get or create a profile for a user
 * Returns the profile with has_completed_onboarding status
 */
export async function getOrCreateProfile(userId: string) {
    try {
        // Try to get existing profile
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (existingProfile) {
            return existingProfile;
        }

        // If profile doesn't exist, create it
        if (fetchError?.code === 'PGRST116') {
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: userId,
                        has_completed_onboarding: false,
                    },
                ])
                .select()
                .single();

            if (insertError) {
                console.error('Error creating profile:', insertError);
                throw insertError;
            }

            return newProfile;
        }

        throw fetchError;
    } catch (error) {
        console.error('Error in getOrCreateProfile:', error);
        throw error;
    }
}

/**
 * Mark onboarding as complete for a user
 */
export async function markOnboardingComplete(userId: string) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ has_completed_onboarding: true })
            .eq('id', userId);

        if (error) {
            console.error('Error marking onboarding complete:', error);
            throw error;
        }

        console.log('✅ Onboarding marked as complete for user:', userId);
    } catch (error) {
        console.error('Error in markOnboardingComplete:', error);
        throw error;
    }
}
