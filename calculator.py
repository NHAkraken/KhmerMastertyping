import math
import customtkinter as ctk

# --- Math Logic ---
def add(x: float, y: float) -> float: return x + y
def subtract(x: float, y: float) -> float: return x - y
def multiply(x: float, y: float) -> float: return x * y
def divide(x: float, y: float) -> float:
    if y == 0: raise ValueError("Cannot divide by zero")
    return x / y
def power(x: float, y: float) -> float:
    try:
        if x == 0 and y < 0:
            raise ValueError("Cannot divide by zero")
        res = x ** y
        if isinstance(res, complex):
            raise ValueError("Invalid operation")
        return res
    except OverflowError:
        raise ValueError("Result too large")
def modulo(x: float, y: float) -> float:
    if y == 0: raise ValueError("Cannot modulo by zero")
    return x % y

OPERATIONS = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
    "^": power,
    "%": modulo,
}

DIGITS = set("0123456789")
MAX_DIGITS = 15


# --- Modern GUI App with Keyboard Support ---
class ModernCalculator(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Calculator")
        self.geometry("340x520")
        self.resizable(False, False)
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        self.first_num = None
        self.operator = None
        self.reset_next = False   # next digit starts a new number
        self.error = False        # display currently shows an error message

        self._build_ui()
        self._bind_keys()

    def _build_ui(self):
        self.history_var = ctk.StringVar(value="")
        self.history_label = ctk.CTkLabel(
            self, textvariable=self.history_var, font=("Segoe UI", 14),
            text_color="#888888", anchor="e"
        )
        self.history_label.pack(fill="x", padx=24, pady=(25, 0))

        self.display_var = ctk.StringVar(value="0")
        self.display = ctk.CTkLabel(
            self, textvariable=self.display_var, font=("Segoe UI", 42, "bold"), anchor="e"
        )
        self.display.pack(fill="x", padx=24, pady=(5, 20))

        btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        btn_frame.pack(expand=True, fill="both", padx=16, pady=(0, 16))

        buttons = [
            ["C", "^", "%", "/"],
            ["7", "8", "9", "*"],
            ["4", "5", "6", "-"],
            ["1", "2", "3", "+"],
            ["±", "0", ".", "="],
        ]

        for r, row in enumerate(buttons):
            btn_frame.grid_rowconfigure(r, weight=1)
            for c, char in enumerate(row):
                btn_frame.grid_columnconfigure(c, weight=1)

                if char == "=":
                    fg, hover = "#2563EB", "#1D4ED8"
                elif char in OPERATIONS or char in ("C", "±"):
                    fg, hover = "#333333", "#444444"
                else:
                    fg, hover = "#1E1E1E", "#2C2C2C"

                btn = ctk.CTkButton(
                    btn_frame,
                    text=char,
                    font=("Segoe UI", 20, "bold"),
                    corner_radius=12,
                    fg_color=fg,
                    hover_color=hover,
                    command=lambda ch=char: self.on_button_click(ch)
                )
                btn.grid(row=r, column=c, padx=5, pady=5, sticky="nsew")

    def _bind_keys(self):
        # One handler for every key. Using event.char/keysym also makes the
        # numpad (KP_Add, KP_Enter, ...) work, which per-character binds missed.
        self.bind("<Key>", self._on_key)

    def _on_key(self, event):
        ch, keysym = event.char, event.keysym
        if keysym in ("Return", "KP_Enter") or ch == "=":
            self.on_button_click("=")
        elif keysym == "Escape" or ch in ("c", "C"):
            self.on_button_click("C")
        elif keysym == "BackSpace":
            self._on_backspace()
        elif ch and (ch in DIGITS or ch == "." or ch in OPERATIONS):
            self.on_button_click(ch)

    # ---------- display helpers ----------
    def _set_display(self, text: str):
        self.display_var.set(text)
        # Shrink font so long numbers / messages don't get cut off.
        n = len(text)
        size = 42 if n <= 9 else 34 if n <= 12 else 26 if n <= 16 else 18
        self.display.configure(font=("Segoe UI", size, "bold"))

    def _show_error(self, msg: str):
        self._set_display(msg or "Error")
        self.history_var.set("")
        self.first_num = None
        self.operator = None
        self.reset_next = True
        self.error = True

    def _clear(self):
        self._set_display("0")
        self.history_var.set("")
        self.first_num = None
        self.operator = None
        self.reset_next = False
        self.error = False

    @staticmethod
    def _compute(op: str, a: float, b: float) -> float:
        result = OPERATIONS[op](a, b)
        if not math.isfinite(result):
            raise ValueError("Result too large")
        return result

    # ---------- input handlers ----------
    def _on_backspace(self):
        if self.error:
            self._clear()
            return
        if self.reset_next:          # don't edit a result / pending operand
            return
        current = self.display_var.get()
        if len(current) <= 1 or (len(current) == 2 and current.startswith("-")):
            self._set_display("0")
        else:
            self._set_display(current[:-1])

    def on_button_click(self, char: str):
        if char == "C":
            self._clear()
            return

        # While an error is shown, only a digit/dot (fresh start) is accepted.
        if self.error:
            if char in DIGITS or char == ".":
                self._clear()
            else:
                return

        current = self.display_var.get()

        if char == "±":
            if self.reset_next and self.operator is not None:
                # Operator pending: start the second number as negative
                self._set_display("-0")
                self.reset_next = False
            elif current not in ("0", "-0"):
                self._set_display(current[1:] if current.startswith("-") else "-" + current)
            return

        if char in OPERATIONS:
            try:
                if self.first_num is not None and self.operator is not None and not self.reset_next:
                    self.first_num = self._compute(self.operator, self.first_num, float(current))
                    self._set_display(self._format_num(self.first_num))
                else:
                    self.first_num = float(current)
                self.operator = char
                self.history_var.set(f"{self._format_num(self.first_num)} {char}")
                self.reset_next = True
            except (ValueError, ZeroDivisionError, OverflowError) as e:
                self._show_error(str(e))
            return

        if char == "=":
            if self.first_num is not None and self.operator is not None:
                try:
                    second_num = float(current)
                    result = self._compute(self.operator, self.first_num, second_num)
                    self.history_var.set(
                        f"{self._format_num(self.first_num)} {self.operator} "
                        f"{self._format_num(second_num)} ="
                    )
                    self._set_display(self._format_num(result))
                    self.first_num = None
                    self.operator = None
                    self.reset_next = True
                except (ValueError, ZeroDivisionError, OverflowError) as e:
                    self._show_error(str(e))
            return

        # Digit or decimal point
        if self.reset_next or current == "0":
            self._set_display("0." if char == "." else char)
            self.reset_next = False
        elif current == "-0":
            self._set_display("-0." if char == "." else "-" + char)
        else:
            if char == "." and "." in current:
                return
            if len(current.replace("-", "").replace(".", "")) >= MAX_DIGITS:
                return
            self._set_display(current + char)

    @staticmethod
    def _format_num(num: float) -> str:
        if num == 0:
            return "0"
        if num.is_integer() and abs(num) < 1e15:
            return str(int(num))
        return f"{num:.10g}"   # keeps tiny/huge values readable (1e-07, 1e+20)


if __name__ == "__main__":
    app = ModernCalculator()
    app.mainloop()
