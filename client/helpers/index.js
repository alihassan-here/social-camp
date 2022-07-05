export const imageSource = user => {
    if (user.image) return user.image.url;
    return "/images/avatar1.png";
}