require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-chivox"
  s.version      = package["version"]
  s.summary      = "A <Video /> element for react-native"
  s.author       = "yunti"

  s.homepage     = "https://github.com/yuntitechreact-native-chivox"

  s.license      = "MIT"

  s.ios.deployment_target = "7.0"
  s.tvos.deployment_target = "9.0"

  s.source       = { :git => "https://github.com/yuntitech/react-native-chivox.git", :tag => "#{s.version}" }

  s.source_files  = "ios/**/*.{h,m}"

  s.dependency "React-Core"
  s.vendored_libraries = 'ios/libaiengine.a','ios/libCAIEngine.a'
  s.libraries = 'bz2', 'c++', 'sqlite3', 'z'
  s.frameworks = 'SystemConfiguration','AudioToolBox', 'AVFoundation','CoreGraphics','Foundation','Security'
  s.ios.framework  = 'UIKit'


end
