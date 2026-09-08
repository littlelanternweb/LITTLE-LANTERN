import javax.swing.*;
import java.awt.*;

public class File{
    public static void main(String[] args) {
      
        JFrame frame = new JFrame("My application");
        
       
        JLabel label = new JLabel("Welcome to String");
        JTextField textfield = new JTextField("14");
        
        JLabel usernameLabel = new JLabel("Username");
        JTextField usernameField = new JTextField();
        
        JLabel passwordLabel = new JLabel("password");
        JPasswordField passwordField = new JPasswordField();
        
        JButton loginButton = new JButton("login");
        
      
        frame.setLayout(new GridLayout(4, 2, 10, 10));
        

        frame.add(label);
        frame.add(textfield);
        
        frame.add(usernameLabel);
        frame.add(usernameField);
        
        frame.add(passwordLabel);
        frame.add(passwordField); 
        
        frame.add(loginButton);    
        
 
        frame.setSize(500, 300);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
     
        frame.setVisible(true);
    }
}