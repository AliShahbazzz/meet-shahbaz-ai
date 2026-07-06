import type { SVGProps } from "react";

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5" />
    </Icon>
  );
}

export function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </Icon>
  );
}

export function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4v-10Z" />
    </Icon>
  );
}

export function IconSliders(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M19 18h1" />
      <circle cx="13" cy="6" r="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </Icon>
  );
}

export function IconRefresh(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.7-5.4L19 8.2" />
      <path d="M19 4.5v3.7h-3.7" />
      <path d="M19.5 12a7.5 7.5 0 0 1-12.7 5.4L5 15.8" />
      <path d="M5 19.5v-3.7h3.7" />
    </Icon>
  );
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.2 2.2 3.4 5 3.4 8s-1.2 5.8-3.4 8c-2.2-2.2-3.4-5-3.4-8s1.2-5.8 3.4-8Z" />
    </Icon>
  );
}

export function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 8.5v7M8.5 12h7" />
    </Icon>
  );
}

export function IconImage(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="m4.5 17.5 5-5 3.5 3.5L17 12l3 3" />
    </Icon>
  );
}

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function IconRocket(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 3c2.5 1.6 4 4.3 4 8.2 0 2-1 4.3-2.3 5.6L12 19l-1.7-2.2C9 15.5 8 13.2 8 11.2 8 7.3 9.5 4.6 12 3Z" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M9 15.5 6.5 17c-.4-1.6-.1-3 .8-4.2M15 15.5l2.5 1.5c.4-1.6.1-3-.8-4.2" />
      <path d="M10.3 18.5c-.2 1-.9 1.8-1.8 2.2M13.7 18.5c.2 1 .9 1.8 1.8 2.2" />
    </Icon>
  );
}

export function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 20c1-3.4 3.4-5 5.5-5s4.5 1.6 5.5 5" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M15.5 12.3c1.9.2 3.6 1.7 4.4 4.5" />
    </Icon>
  );
}

export function IconBrain(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.3A2.5 2.5 0 0 0 5.5 12 2.5 2.5 0 0 0 7 16.5 2.5 2.5 0 0 0 9.5 19V4.5Z" />
      <path d="M14.5 4.5A2.5 2.5 0 0 1 17 7v.3a2.5 2.5 0 0 1 1.5 4.7A2.5 2.5 0 0 1 17 16.5 2.5 2.5 0 0 1 14.5 19V4.5Z" />
      <path d="M9.5 8.5h5M9.5 12h5M9.5 15.5h5" />
    </Icon>
  );
}

export function IconCode(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m9 8-4.5 4L9 16M15 8l4.5 4L15 16" />
    </Icon>
  );
}

export function IconMessageCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 4.5c-4.4 0-8 3-8 6.7 0 2 1.1 3.8 2.8 5L6 19.5l3.4-1.2c.8.2 1.7.3 2.6.3 4.4 0 8-3 8-6.7s-3.6-6.9-8-6.9Z" />
    </Icon>
  );
}

export function IconBriefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M8.5 8V6.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V8" />
      <path d="M3 13h18M10.5 13v1.5h3V13" />
    </Icon>
  );
}
