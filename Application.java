import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

public class app {

    static ArrayList<String> books = new ArrayList<>();

    public static void main(String args[]) {

        loginWindow();
    }

    // LOGIN WINDOW
    public static void loginWindow() {

        JFrame frame = new JFrame("Login");

        JPanel panel = new JPanel(
                new GridLayout(3, 2, 10, 10)
        );

        JLabel usernameLabel = new JLabel("Username");
        JTextField usernameField = new JTextField();

        JLabel passwordLabel = new JLabel("Password");
        JPasswordField passwordField = new JPasswordField();

        JButton loginButton = new JButton("Login");
        JButton exitButton = new JButton("Exit");

        panel.add(usernameLabel);
        panel.add(usernameField);

        panel.add(passwordLabel);
        panel.add(passwordField);

        panel.add(loginButton);
        panel.add(exitButton);

        frame.add(panel);

        frame.setSize(400, 250);
        frame.setLocationRelativeTo(null);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);

        // LOGIN LISTENER
        loginButton.addActionListener(new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                String username =
                        usernameField.getText();

                String password =
                        new String(
                                passwordField.getPassword()
                        );

                if (username.equals("admin")
                        && password.equals("123")) {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Login Successful!"
                    );

                    frame.dispose();

                    dashboard();

                } else {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Username or Password is wrong!",
                            "Login Error",
                            JOptionPane.ERROR_MESSAGE
                    );
                }
            }
        });

        // EXIT LISTENER
        exitButton.addActionListener(new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                System.exit(0);
            }
        });
    }


    // DASHBOARD
    public static void dashboard() {

        JFrame frame = new JFrame(
                "Library Management System"
        );

        JPanel mainPanel =
                new JPanel(new BorderLayout());

        JLabel welcomeLabel = new JLabel(
                "Welcome to Library Management System",
                SwingConstants.CENTER
        );

        // BUTTON PANEL
        JPanel buttonPanel = new JPanel(
                new GridLayout(3, 2, 20, 20)
        );

        JButton addBookButton =
                new JButton("Add Book");

        JButton viewBookButton =
                new JButton("View Books");

        JButton searchBookButton =
                new JButton("Search Book");

        JButton logoutButton =
                new JButton("Logout");

        JButton exitButton =
                new JButton("Exit");

        buttonPanel.add(addBookButton);
        buttonPanel.add(viewBookButton);

        buttonPanel.add(searchBookButton);
        buttonPanel.add(logoutButton);

        buttonPanel.add(new JLabel(""));
        buttonPanel.add(exitButton);

        buttonPanel.setPreferredSize(
                new Dimension(450, 350)
        );

        mainPanel.add(
                welcomeLabel,
                BorderLayout.NORTH
        );

        mainPanel.add(
                buttonPanel,
                BorderLayout.CENTER
        );

        frame.add(mainPanel);

        // ADD BOOK
        addBookButton.addActionListener(
                new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                String book =
                        JOptionPane.showInputDialog(
                                frame,
                                "Enter Book Name:"
                        );

                if (book != null &&
                        !book.trim().isEmpty()) {

                    books.add(book);

                    JOptionPane.showMessageDialog(
                            frame,
                            "Book Added Successfully!"
                    );
                }
            }
        });


        // VIEW BOOKS
        viewBookButton.addActionListener(
                new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                if (books.isEmpty()) {

                    JOptionPane.showMessageDialog(
                            frame,
                            "No books available."
                    );

                } else {

                    String bookList = "";

                    for (int i = 0;
                            i < books.size(); i++) {

                        bookList +=
                                (i + 1)
                                + ". "
                                + books.get(i)
                                + "\n";
                    }

                    JOptionPane.showMessageDialog(
                            frame,
                            bookList,
                            "Available Books",
                            JOptionPane.INFORMATION_MESSAGE
                    );
                }
            }
        });


        // SEARCH BOOK
        searchBookButton.addActionListener(
                new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                String search =
                        JOptionPane.showInputDialog(
                                frame,
                                "Enter Book Name to Search:"
                        );

                if (search == null)
                    return;

                boolean found = false;

                for (String book : books) {

                    if (book.equalsIgnoreCase(search)) {

                        found = true;
                        break;
                    }
                }

                if (found) {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Book Found!"
                    );

                } else {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Book Not Found!"
                    );
                }
            }
        });


        // LOGOUT
        logoutButton.addActionListener(
                new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                int choice =
                        JOptionPane.showConfirmDialog(
                                frame,
                                "Do you want to logout?",
                                "Logout",
                                JOptionPane.YES_NO_OPTION
                        );

                if (choice ==
                        JOptionPane.YES_OPTION) {

                    frame.dispose();

                    loginWindow();
                }
            }
        });


        // EXIT
        exitButton.addActionListener(
                new ActionListener() {

            public void actionPerformed(ActionEvent e) {

                int choice =
                        JOptionPane.showConfirmDialog(
                                frame,
                                "Do you want to exit?",
                                "Exit",
                                JOptionPane.YES_NO_OPTION
                        );

                if (choice ==
                        JOptionPane.YES_OPTION) {

                    System.exit(0);
                }
            }
        });


        frame.setSize(600, 550);
        frame.setLocationRelativeTo(null);
        frame.setDefaultCloseOperation(
                JFrame.EXIT_ON_CLOSE
        );
        frame.setVisible(true);
    }
}