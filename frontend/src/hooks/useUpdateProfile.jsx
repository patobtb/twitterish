import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const {mutateAsync: updateProfile, isPending: isUpdatingProfile} = useMutation({
        mutationFn: async (formData) => {
          try {
            const response = await fetch("/api/users/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData)
            });
    
            const data = await response.json();
    
            if (!response.ok) {
              throw new Error(data.error || "An error occurred while updating the profile");
            }
    
            console.log(data);
            return data;
          } catch (error) {
            console.error(error);
            throw new Error(error.message);
          }
        },
        onSuccess: () => {
          toast.success("Profile updated successfully");
          Promise.all([
            queryClient.invalidateQueries({queryKey: ["authUser"]}),
            queryClient.invalidateQueries({queryKey: ["userProfile"]})
          ])
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
      return {updateProfile, isUpdatingProfile};
};

export default useUpdateProfile;