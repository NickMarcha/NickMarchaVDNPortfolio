# Portfolio page made with Vite w/ React & Tanstack  And DotNet C# Backend /w EF Core & Azure
A couple years ago I made a portfolio page using Create React App and a node backend, The page is still live [here](https://portfolio.nickmarcha.com/login) with the source available [here](https://github.com/NickMarcha/NickMarchaPortfolio).

I decided to recreate the page, with some changes using mix of tech, kind of my current ideal prototype stack.

# Why this stack

## Backend

For the backend, I chose a familiar setup: a .NET C# server using Entity Framework Core, connected to an Azure SQL database.

I went with .NET and EF Core because I'm comfortable with them and genuinely enjoy working in that environment.

As for Azure, I picked it to explore something outside of AWS (which I use regularly at work) and MongoDB (which I used in a previous version).

## Frontend

For the frontend, I picked technologies I often wish I could use in professional projects:

- React: I'm familiar with it and enjoy working with it.
- TanStack (formerly React Query) with TanStack Router: Type-safe routing and built-in search params handling are incredibly appealing.
- Vite: From what I understand, Vite and Next.js are the most popular and well-regarded frameworks right now. I chose Vite because I don't need server-side rendering (SSR), which is a primary focus of Next.js.
- Tailwind CSS: Honestly, I’m tired of naming CSS classes. More seriously, I like the idea of styles being colocated with the HTML. Tailwind encourages a “one style per component” mindset, which I find practical and effective.

# How am I deploying?

I have a linux homeserver setup with docker and a tailscale network, I'm also using an oracle free tier to host a reverse proxy connected to the same tailscale network. 
This is to overcome my network limitations at home, as I'm behind a router outside of my control.


# Todo List
 - [x] Test Backend Configuration
 - [ ] Test Frontend Configuration
 - [ ] CMS components
     - [ ] Backend
     - [ ] Frontend
