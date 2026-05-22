import java.util.*;

public class RemoveDup {
    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 3};

        Set<Integer> set = new LinkedHashSet<>();
        for (int num : arr) set.add(num);

        System.out.println(set);
    }
}