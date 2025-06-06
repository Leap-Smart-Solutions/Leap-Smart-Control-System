import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lottie/lottie.dart';
import 'package:http/http.dart' as http;
import 'components/EnergyCard.dart';
import 'EnergyCardDark.dart';
import 'FrostedDeviceCard.dart';
import 'AddDevice.dart';
import 'tochat.dart';
import 'security/sechome.dart';
import 'Air Condition.dart';
import 'package:provider/provider.dart';
import 'theme_provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String selectedLabel = 'Bedroom';
  int _selectedIndex = 0;

  Map<String, List<bool>> roomDeviceStates = {
    'Bedroom': [false, false, false, false, false, false],
    'Living Room': [false, false, false, false],
    'Kitchen': [false, false, false, false],
  };

  @override
  void initState() {
    super.initState();
    loadDeviceStates();
  }

  Future<void> loadDeviceStates() async {
    final prefs = await SharedPreferences.getInstance();
    for (var room in roomDeviceStates.keys) {
      List<String>? savedList = prefs.getStringList('room_$room');
      if (savedList != null) {
        // Ensure the loaded list matches the expected length
        final expectedLength = room == 'Bedroom' ? 6 : 4;
        List<bool> loadedStates = savedList.map((e) => e == 'true').toList();
        // Pad or truncate to match expected length
        if (loadedStates.length < expectedLength) {
          loadedStates.addAll(List.filled(expectedLength - loadedStates.length, false));
        } else if (loadedStates.length > expectedLength) {
          loadedStates = loadedStates.sublist(0, expectedLength);
        }
        roomDeviceStates[room] = loadedStates;
      }
    }
    setState(() {});
  }

  Future<void> saveDeviceStates() async {
    final prefs = await SharedPreferences.getInstance();
    for (var room in roomDeviceStates.keys) {
      prefs.setStringList(
        'room_$room',
        roomDeviceStates[room]!.map((e) => e.toString()).toList(),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;
    final isDarkMode = Provider.of<ThemeController>(context).isDarkMode;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          Positioned.fill(
            child: ImageFiltered(
              imageFilter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Opacity(
                opacity: 0.999,
                child: Image.asset(
                  isDarkMode ? 'assets/space4.jpg' : 'assets/16.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.only(bottom: screenHeight * 0.12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Stack(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(top: 0),
                        child: isDarkMode ? const EnergyCardDarkMode() : const EnergyCard(),
                      ),
                      Padding(
                        padding: EdgeInsets.only(top: screenHeight * 0.28),
                        child: Align(
                          alignment: getLabelAlignment(selectedLabel),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              buildClickableLabel('Bedroom', screenWidth, isDarkMode),
                              buildClickableLabel('Living Room', screenWidth, isDarkMode),
                              buildClickableLabel('Kitchen', screenWidth, isDarkMode),
                            ],
                          ),
                        ),
                      ),
                      if (selectedLabel.isNotEmpty)
                        Padding(
                          padding: EdgeInsets.only(top: screenHeight * 0.25),
                          child: Align(
                            alignment: getLabelAlignment(selectedLabel),
                            child: Lottie.asset(
                              "assets/ani.json",
                              width: screenWidth * 0.25,
                              height: screenHeight * 0.1,
                            ),
                          ),
                        ),
                    ],
                  ),
                  _buildDeviceGrid(screenWidth, isDarkMode),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: ClipRRect(
        borderRadius: BorderRadius.circular(60),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.35),
              borderRadius: BorderRadius.circular(60),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildFancyIcon(0, Icons.home, "Home"),
                _buildFancyIcon(1, Icons.security, "Security"),
                _buildFancyIcon(2, Icons.chat_bubble_outline, "Chatbot"),
                _buildFancyIcon(3, Icons.add, "Device"),
                const SizedBox(width: 7),
                GestureDetector(
                  onTap: () {
                    Provider.of<ThemeController>(context, listen: false).toggleTheme();
                  },
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      color: Colors.white10,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isDarkMode ? Icons.dark_mode : Icons.light_mode,
                      size: 24,
                      color: isDarkMode ? Colors.black : Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _buildDeviceGrid(double screenWidth, bool isDarkMode) {
    final room = selectedLabel;
    final textColor = isDarkMode ? Colors.white : Colors.black;
    final backgroundStartColor = isDarkMode ? Colors.white.withOpacity(0.25) : Colors.black.withOpacity(0.05);
    final backgroundEndColor = isDarkMode ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.01);
    final borderColor = isDarkMode ? Colors.white.withOpacity(0.3) : Colors.black.withOpacity(0.2);

    // Define device configurations for each room using only existing assets
    final Map<String, List<Map<String, dynamic>>> roomDevices = {
      'Bedroom': [
        {
          'title1': 'Air Conditioner',
          'subtitle1': '20 min',
          'title2': 'Distance',
          'subtitle2': '5 m',
          'imagePath': 'assets/air.png',
          'icon': Icons.ac_unit,
          'isAir': true,
          'stateIndex': 0,
        },
        {
          'title1': 'Ceiling Light',
          'subtitle1': '12 hrs',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 1 && roomDeviceStates[room]![ 1] ? 'On' : 'Off'),
          'imagePath': 'assets/lampp.png',
          'icon': Icons.lightbulb_outline,
          'isAir': false,
          'stateIndex': 1,
        },
        {
          'title1': 'Door Lock',
          'subtitle1': 'Locked',
          'title2': 'State',
          'subtitle2': (roomDeviceStates[room]!.length > 2 && roomDeviceStates[room]![2] ? 'Locked' : 'Unlocked'),
          'imagePath': 'assets/door.png',
          'icon': Icons.door_front_door,
          'isAir': false,
          'stateIndex': 2,
        },
        {
          'title1': 'Vacuum',
          'subtitle1': '20 min',
          'title2': 'Distance',
          'subtitle2': '33 m',
          'imagePath': 'assets/vacuum.png',
          'icon': Icons.cleaning_services,
          'isAir': false,
          'stateIndex': 3,
        },
        {
          'title1': 'Bedside Light',
          'subtitle1': '8 hrs',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 4 && roomDeviceStates[room]![4] ? 'On' : 'Off'),
          'imagePath': 'assets/lampp.png',
          'icon': Icons.lightbulb_outline,
          'isAir': false,
          'stateIndex': 4,
        },
        {
          'title1': 'Power Outlet',
          'subtitle1': '15 min',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 5 && roomDeviceStates[room]![5] ? 'On' : 'Off'),
          'imagePath': 'assets/air.png',
          'icon': Icons.power,
          'isAir': false,
          'stateIndex': 5,
        },
      ],
      'Living Room': [
        {
          'title1': 'Main Light',
          'subtitle1': '10 hrs',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 1 && roomDeviceStates[room]![1] ? 'On' : 'Off'),
          'imagePath': 'assets/lampp.png',
          'icon': Icons.lightbulb_outline,
          'isAir': false,
          'stateIndex': 1,
        },
        {
          'title1': 'Door Lock',
          'subtitle1': 'Locked',
          'title2': 'State',
          'subtitle2': (roomDeviceStates[room]!.length > 2 && roomDeviceStates[room]![2] ? 'Locked' : 'Unlocked'),
          'imagePath': 'assets/door.png',
          'icon': Icons.door_front_door,
          'isAir': false,
          'stateIndex': 2,
        },
        {
          'title1': 'Vacuum',
          'subtitle1': '25 min',
          'title2': 'Distance',
          'subtitle2': '30 m',
          'imagePath': 'assets/vacuum.png',
          'icon': Icons.cleaning_services,
          'isAir': false,
          'stateIndex': 3,
        },
        {
          'title1': 'Power Outlet',
          'subtitle1': '1 hr',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 0 && roomDeviceStates[room]![0] ? 'On' : 'Off'),
          'imagePath': 'assets/air.png',
          'icon': Icons.power,
          'isAir': false,
          'stateIndex': 0,
        },
      ],
      'Kitchen': [
        {
          'title1': 'Refrigerator',
          'subtitle1': 'Running',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 0 && roomDeviceStates[room]![0] ? 'On' : 'Off'),
          'imagePath': 'assets/air.png',
          'icon': Icons.kitchen,
          'isAir': false,
          'stateIndex': 0,
        },
        {
          'title1': 'Kitchen Light',
          'subtitle1': '8 hrs',
          'title2': 'Status',
          'subtitle2': (roomDeviceStates[room]!.length > 1 && roomDeviceStates[room]![1] ? 'On' : 'Off'),
          'imagePath': 'assets/lampp.png',
          'icon': Icons.lightbulb_outline,
          'isAir': false,
          'stateIndex': 1,
        },
        {
          'title1': 'Back Door',
          'subtitle1': 'Locked',
          'title2': 'State',
          'subtitle2': (roomDeviceStates[room]!.length > 2 && roomDeviceStates[room]![2] ? 'Locked' : 'Unlocked'),
          'imagePath': 'assets/door.png',
          'icon': Icons.door_front_door,
          'isAir': false,
          'stateIndex': 2,
        },
        {
          'title1': 'Vacuum',
          'subtitle1': '15 min',
          'title2': 'Distance',
          'subtitle2': '20 m',
          'imagePath': 'assets/vacuum.png',
          'icon': Icons.cleaning_services,
          'isAir': false,
          'stateIndex': 3,
        },
      ],
    };

    // Validate that the room exists in roomDevices
    if (!roomDevices.containsKey(room)) {
      return const Center(child: Text('Invalid room selected'));
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
      child: Wrap(
        spacing: 15,
        runSpacing: 10,
        alignment: WrapAlignment.start,
        children: List.generate(roomDevices[room]!.length, (i) {
          final device = roomDevices[room]![i];
          // Validate stateIndex
          final stateIndex = device['stateIndex'] as int;
          if (stateIndex >= roomDeviceStates[room]!.length) {
            return const SizedBox.shrink(); // Skip invalid indices
          }
          return GestureDetector(
            onTap: () {
              if (device['isAir']) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => air()),
                );
              }
            },
            child: FrostedDeviceCard(
              title1: device['title1'],
              subtitle1: device['subtitle1'],
              title2: device['title2'],
              subtitle2: device['subtitle2'],
              imagePath: device['imagePath'],
              icon: device['icon'],
              isOn: roomDeviceStates[room]![stateIndex],
              onChanged: (val) {
                setState(() {
                  roomDeviceStates[room]![stateIndex] = val;
                });
                saveDeviceStates();

                if (device['title1'] == 'Ceiling Light' || device['title1'] == 'Bedside Light' ||
                    device['title1'] == 'Main Light' || device['title1'] == 'Kitchen Light' ||
                    device['title1'] == 'Power Outlet' || device['title1'] == 'Refrigerator') {
                  final int newValue = val ? 1 : 0;
                  http.put(
                    Uri.parse('https://leap-smart-band-default-rtdb.firebaseio.com/IMU_Data.json'),
                    body: newValue.toString(),
                    headers: {'Content-Type': 'application/json'},
                  );
                }
              },
              customIcon: device['title1'] == 'Ceiling Light' || device['title1'] == 'Bedside Light' ||
                  device['title1'] == 'Main Light' || device['title1'] == 'Kitchen Light' ||
                  device['title1'] == 'Power Outlet' || device['title1'] == 'Refrigerator'
                  ? GestureDetector(
                onTap: () {
                  final newState = !roomDeviceStates[room]![stateIndex];
                  setState(() {
                    roomDeviceStates[room]![stateIndex] = newState;
                  });
                  saveDeviceStates();

                  final int newValue = newState ? 1 : 0;
                  http.put(
                    Uri.parse('https://leap-smart-band-default-rtdb.firebaseio.com/IMU_Data.json'),
                    body: newValue.toString(),
                    headers: {'Content-Type': 'application/json'},
                  );
                },
                child: Container(
                  width: 30,
                  height: 30,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                  ),
                  child: Icon(
                    roomDeviceStates[room]![stateIndex] ? Icons.power_settings_new : Icons.power_settings_new_outlined,
                    color: roomDeviceStates[room]![stateIndex] ? Colors.green : Colors.grey,
                    size: 18,
                  ),
                ),
              )
                  : null,
              textColor: textColor,
              backgroundStartColor: backgroundStartColor,
              backgroundEndColor: backgroundEndColor,
              borderColor: borderColor,
            ),
          );
        }),
      ),
    );
  }

  Widget _buildFancyIcon(int index, IconData icon, String label) {
    bool isSelected = _selectedIndex == index;
    final screenWidth = MediaQuery.of(context).size.width;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
        if (index == 3) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddDeviceScreen()),
          );
        }else if (index == 2) {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const AssistantHomeScreen()));
        }else if (index == 1) {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const SmartHomeApp()));
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white.withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(40),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: screenWidth * 0.119,
              height: screenWidth * 0.119,
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF7A7A7A) : Colors.white.withOpacity(0.10),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 28, color: Colors.white),
            ),
            if (isSelected) const SizedBox(width: 9),
            if (isSelected)
              Padding(
                padding: const EdgeInsets.only(right: 6),
                child: Text(
                  label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget buildClickableLabel(String label, double screenWidth, bool isDarkMode) {
    final bool isSelected = selectedLabel == label;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedLabel = label;
        });
      },
      child: Text(
        label,
        style: TextStyle(
          fontFamily: 'Lexend',
          fontSize: screenWidth * (isSelected ? 0.052 : 0.04),
          fontWeight: FontWeight.bold,
          color: isSelected
              ? (isDarkMode ? Colors.white : Colors.black)
              : (isDarkMode ? const Color(0xF9A3A2A2) : const Color(0xFF666666)),
        ),
      ),
    );
  }

  Alignment getLabelAlignment(String label) {
    switch (label) {
      case 'Bedroom':
        return const Alignment(-0.76, 0);
      case 'Living Room':
        return const Alignment(0, 0);
      case 'Kitchen':
        return const Alignment(0.76, 0);
      default:
        return Alignment.center;
    }
  }
}