import { Calendar, CheckSquare, ImageIcon, PlusSquare } from "lucide-react";
import Link from "next/link";

export default function HowToUsePage() {
  const features = [
    {
      title: "Create a Bond",
      description:
        "Start by creating a new bond. This is your group or connection with others.",
      icon: PlusSquare,
      steps: [
        "Click on 'Create Bond'",
        "Enter a name for your bond",
        "Add an optional description",
        "Invite members to join your bond",
      ],
      image: "/create-bond.png",
    },
    {
      title: "Create Activities",
      description: "List fun activities for your bond in each cell.",
      icon: Calendar,
      steps: ["Click on a bingo cell", "Enter an activity", "Save the plan"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Plan Activities",
      description: "Plan activities for the future.",
      icon: CheckSquare,
      steps: [
        "Go to the plan page of your bond",
        "Create a plan from your existing activity.",
        "Reminders will be sent to everyone a day in advance.",
        "Get ready to have fun!",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Create Memories",
      description: "Add memories to commemorate completed activities.",
      icon: ImageIcon,
      steps: [
        "After completing a plan, click 'Add To Memory'",
        "The plan is moved to the memories page",
        "Upload pictures from the activity",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-16">
          How to Use{" "}
          <Link href="/" className="text-primary">
            Bingo Bond
          </Link>
        </h1>
        <div className="flex flex-col mb-8 gap-10">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col gap-6 items-center ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center space-x-2 text-primary">
                  <span className="text-xl mr-1">{index + 1}.</span>
                  <h2 className="text-2xl font-medium pr-1">{feature.title}</h2>
                  <feature.icon className="h-6 w-6" />
                </div>
                <p className="text-lg text-muted-foreground">
                  {feature.description}
                </p>
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                  {feature.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="pl-2 leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
        <Link
          href={"/"}
          className="text-primary hover:underline rounded-md font-medium mt-4"
        >
          Understood! Back to Home
        </Link>
      </div>
    </div>
  );
}
