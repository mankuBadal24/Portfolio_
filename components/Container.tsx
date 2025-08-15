import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Container({ className, ...props }: Props) {
  return <div className={cn("container", className)} {...props} />;
}
