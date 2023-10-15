todos = []


while True:
    user_action = input("Type add, show ot exit: ")
    user_action = user_action.strip()

    match user_action:
        case "add":
            todo = input("Enter a todo:")
            todos.append(todo)
        case "show" | "display":
            for item in todos:
                item = item.title()
                print(item)
        case "exit":
            break
        case _:
            print("You entered an unknown command.")

print("Bye!")
