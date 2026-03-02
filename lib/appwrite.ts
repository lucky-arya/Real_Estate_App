import { Account, Avatars, Client, Databases, OAuthProvider, Query, } from "react-native-appwrite";

import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";


export const config = {
  platform : "com.shivam.realestate",
  endpoint : process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId : process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentsCollectionId : process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  galleriesCollectionId : process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId : process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  propertiesCollectionId : process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
}

// Initialize Appwrite client
const client = new Client()
  .setProject(config.projectId!)
  .setEndpoint(config.endpoint!)
  .setPlatform(config.platform!);

export { client };


export const avatar =  new Avatars(client)
export const account = new Account(client)
export const databases = new Databases(client)

export async function login(){
  try {
    // console.log("=== Starting Google Login ===");
    // console.log("Endpoint:", config.endpoint);
    // console.log("Project ID:", config.projectId);
    // console.log("Platform:", config.platform);

    const redirectUri = Linking.createURL('/')
    console.log("Redirect URI:", redirectUri);
    
    console.log("Creating OAuth2 token...");
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri,
      redirectUri // failure redirect (same as success for simplicity)
    )

    if(!response){
      throw new Error("Failed to create OAuth token. Please check your Appwrite configuration.")
    }
    
    // console.log("Opening auth session in browser...");
    // console.log("OAuth URL:", response.toString());
    const browserResult = await openAuthSessionAsync(response.toString(), redirectUri)
    console.log("Browser result type:", browserResult.type);

    if(browserResult.type !== "success"){
       if(browserResult.type === "cancel"){
        throw new Error("Login cancelled. Please try again.")
      }
      throw new Error(`Authentication failed. Browser result: ${browserResult.type}`)
    }

    // console.log("Browser URL:", browserResult.url);

    const url = new URL(browserResult.url)
    const secret = url.searchParams.get("secret")?.toString()
    const userId = url.searchParams.get("userId")?.toString()

    // console.log("User ID:", userId ? "present" : "missing");
    // console.log("Secret:", secret ? "present" : "missing");
    // console.log("All URL params:", Array.from(url.searchParams.entries()));

    if(!secret || !userId){
      throw new Error(`Authentication response is incomplete. Received params: ${Array.from(url.searchParams.keys()).join(', ') || 'none'}`)
    }

    // console.log("Creating session...");
    const session = await account.createSession(userId, secret)

    if(!session){
      throw new Error("Failed to create user session. Please contact support.")
    }

    // console.log("=== Login successful ===");
    return { success: true };
    

  } catch (error: any) {
    console.error("=== Login failed ===");
    console.error("Error details:", error);
    console.error("Error message:", error?.message);
    console.error("Error type:", error?.type);
    console.error("Error code:", error?.code);
    
    let errorMessage = error?.message || "An unexpected error occurred. Please try again.";
    
    // Handle Appwrite-specific errors
    if (error?.type) {
      errorMessage = `Appwrite Error: ${error.message || error.type}`;
    }
    
    return { success: false, error: errorMessage };
  }
}


export async function logout(){
  try {
    await account.deleteSession("current")
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export async function getCurrentUser(){
  try {
    const response = await account.get()

    if(!response){
      return null;
    }

    if(response.$id){
      // Construct avatar URL manually
      const userName = response.name || response.email;
      const avatarUrl = `${config.endpoint}/avatars/initials?name=${encodeURIComponent(userName)}&width=400&height=400`;
      
      // console.log("User avatar URL:", avatarUrl);

      return { 
        ...response, 
        avatar: avatarUrl 
      }
    }

    return null;
    
  } catch (error: any) {
    // If user is not logged in (guests role), silently return null
    if (error?.type === 'user_unauthorized' || error?.code === 401) {
      return null;
    }
    
    // Log other unexpected errors
    console.error("Getting user failed:", error);
    return null;
  }
}



export async function getLatestProperties(){
  try {

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
       [ Query.orderAsc("$createdAt"),Query.limit(5) ]
    );
    
    return result.documents;
  } catch (error) {
    console.error(error);
    return[];
  }
}

export async function getProperties({
  filter,query,limit
} : {
  filter?: string;
  query?: string;
  limit?: number;
}){
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if(filter && filter !== "All"){
      buildQuery.push(Query.equal("type", filter))
    }
    if(query){
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query)
        ])
      )
    }
    if(limit){
      buildQuery.push(Query.limit(limit))
    }
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );
    return result.documents;
  } catch (error) {
    console.error(error);
    return[];
  }
}
 export async function getPropertyById({ id }: { id: string }){
  try {
    const property = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );

    // Fetch the agent details
    const agent = await databases.getDocument(
      config.databaseId!,
      config.agentsCollectionId!,
      property.agent
    );

    // Fetch the reviews details
    const reviews = property.reviews && Array.isArray(property.reviews) 
      ? await Promise.all(
          (property.reviews as string[]).map((reviewId: string) =>
            databases.getDocument(
              config.databaseId!,
              config.reviewsCollectionId!,
              reviewId
            )
          )
        )
      : [];

    // Fetch the gallery details
    const gallery = property.gallery && Array.isArray(property.gallery)
      ? await Promise.all(
          (property.gallery as string[]).map((galleryId: string) =>
            databases.getDocument(
              config.databaseId!,
              config.galleriesCollectionId!,
              galleryId
            )
          )
        )
      : [];

    return {
      ...property,
      agent,
      reviews,
      gallery,
    } as any;
  } catch (error) {
    console.error(error);
    return null;
  }
}


