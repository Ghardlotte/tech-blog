async function addpostFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#title-post').value.trim();
    const post_text = document.querySelector('#text-post').value.trim();
    
    if (title && post_text) {
        const response = await fetch('/api/posts', {
            method: 'post',
            body: JSON.stringify({
                title,
                post_text
            }),
            headers: { 'Content-Type': "application/json"}
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('#post-form').addEventListener('submit', addpostFormHandler)