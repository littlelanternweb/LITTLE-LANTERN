import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class app {
    public static void main(String args[]) {

        JFrame frame = new JFrame("Library Management System");

        JPanel mainPanel = new JPanel(new BorderLayout());

        JPanel centerPanel = new JPanel(
                new FlowLayout(FlowLayout.CENTER, 0, 20)
        );

        JPanel formPanel = new JPanel(
                new GridLayout(8, 2, 10, 10)
        );

        JLabel welcomeLabel = new JLabel(
                "Welcome to Library Management System",
                SwingConstants.CENTER
        );

        // Username
        JLabel usernameLabel = new JLabel("Username");
        JTextField usernameField = new JTextField();

        // Password
        JLabel passwordLabel = new JLabel("Password");
        JPasswordField passwordField = new JPasswordField();

        // Name
        JLabel nameLabel = new JLabel("Name");
        JTextField nameField = new JTextField();

        // Mail
        JLabel mailLabel = new JLabel("Mail");
        JTextField mailField = new JTextField();

        // Phone
        JLabel phoneLabel = new JLabel("Ph Number");
        JTextField phoneField = new JTextField();

        // Gender
        JLabel genderLabel = new JLabel("Gender");

        JRadioButton maleButton = new JRadioButton("Male");
        JRadioButton femaleButton = new JRadioButton("Female");
        JRadioButton otherButton = new JRadioButton("Other");

        ButtonGroup genderGroup = new ButtonGroup();
        genderGroup.add(maleButton);
        genderGroup.add(femaleButton);
        genderGroup.add(otherButton);

        JPanel genderPanel = new JPanel(
                new FlowLayout(FlowLayout.LEFT)
        );

        genderPanel.add(maleButton);
        genderPanel.add(femaleButton);
        genderPanel.add(otherButton);

        // Course
        JLabel courseLabel = new JLabel("Course");

        JRadioButton btechButton = new JRadioButton("B.Tech");
        JRadioButton bcaButton = new JRadioButton("BCA");
        JRadioButton bscButton = new JRadioButton("B.Sc");
        JRadioButton mcaButton = new JRadioButton("MCA");

        ButtonGroup courseGroup = new ButtonGroup();
        courseGroup.add(btechButton);
        courseGroup.add(bcaButton);
        courseGroup.add(bscButton);
        courseGroup.add(mcaButton);

        JPanel coursePanel = new JPanel(
                new FlowLayout(FlowLayout.LEFT)
        );

        coursePanel.add(btechButton);
        coursePanel.add(bcaButton);
        coursePanel.add(bscButton);
        coursePanel.add(mcaButton);

        // Buttons
        JButton loginButton = new JButton("Login");
        JButton clearButton = new JButton("Clear");

        // Add components
        formPanel.add(usernameLabel);
        formPanel.add(usernameField);

        formPanel.add(passwordLabel);
        formPanel.add(passwordField);

        formPanel.add(nameLabel);
        formPanel.add(nameField);

        formPanel.add(mailLabel);
        formPanel.add(mailField);

        formPanel.add(phoneLabel);
        formPanel.add(phoneField);

        formPanel.add(genderLabel);
        formPanel.add(genderPanel);

        formPanel.add(courseLabel);
        formPanel.add(coursePanel);

        formPanel.add(loginButton);
        formPanel.add(clearButton);

        centerPanel.add(formPanel);

        mainPanel.add(welcomeLabel, BorderLayout.NORTH);
        mainPanel.add(centerPanel, BorderLayout.CENTER);

        frame.add(mainPanel);

        // LOGIN BUTTON
        loginButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                String username = usernameField.getText();
                String password =
                        new String(passwordField.getPassword());

                String gender = "";

                if (maleButton.isSelected())
                    gender = "Male";
                else if (femaleButton.isSelected())
                    gender = "Female";
                else if (otherButton.isSelected())
                    gender = "Other";

                String course = "";

                if (btechButton.isSelected())
                    course = "B.Tech";
                else if (bcaButton.isSelected())
                    course = "BCA";
                else if (bscButton.isSelected())
                    course = "B.Sc";
                else if (mcaButton.isSelected())
                    course = "MCA";

                if (username.equals("admin")
                        && password.equals("1234")) {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Login Successful!\n"
                            + "Name: " + nameField.getText()
                            + "\nMail: " + mailField.getText()
                            + "\nPhone: " + phoneField.getText()
                            + "\nGender: " + gender
                            + "\nCourse: " + course
                    );
                }

                else if (!username.equals("admin")
                        && !password.equals("1234")) {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Username and Password are wrong!",
                            "Login Error",
                            JOptionPane.ERROR_MESSAGE
                    );
                }

                else if (!username.equals("admin")) {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Username is wrong!",
                            "Login Error",
                            JOptionPane.ERROR_MESSAGE
                    );
                }

                else {

                    JOptionPane.showMessageDialog(
                            frame,
                            "Password is wrong!",
                            "Login Error",
                            JOptionPane.ERROR_MESSAGE
                    );
                }
            }
        });

        // CLEAR BUTTON
        clearButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {

                usernameField.setText("");
                passwordField.setText("");
                nameField.setText("");
                mailField.setText("");
                phoneField.setText("");

                genderGroup.clearSelection();
                courseGroup.clearSelection();

                usernameField.requestFocus();
            }
        });

        // Frame settings
        frame.setSize(650, 500);
        frame.setLocationRelativeTo(null);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}